import { gunzipSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CHART_REPO = "superplanehq/superplane-chart";
const OUTPUT = new URL("../src/data/superplane-chart.json", import.meta.url);
const VERSION_RE = /^v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-(?<pre>[0-9A-Za-z.-]+))?$/;
const COMPONENT_VERSION_RE = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const TOKEN = "@@SUPERPLANE_CHART_VERSION@@";
const FLEET_MANAGER_TOKEN = "@@FLEET_MANAGER_VERSION@@";
const FLEET_MANAGER_CHART_TOKEN = "@@FLEET_MANAGER_CHART_VERSION@@";
const RUNNER_TOKEN = "@@RUNNER_VERSION@@";
const VALUES_PATH = "superplane-chart/values.yaml";

function parseVersion(tag) {
  const match = VERSION_RE.exec(tag);
  if (!match?.groups) return null;
  const { major, minor, patch, pre } = match.groups;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    pre: pre ? prereleaseParts(pre) : [],
    chartVersion: `${major}.${minor}.${patch}${pre ? `-${pre}` : ""}`,
  };
}

function prereleaseParts(pre) {
  const parts = [];
  for (const piece of pre.split(".")) {
    const releaseCandidate = /^rc(\d+)$/i.exec(piece);
    if (releaseCandidate) {
      parts.push("rc", releaseCandidate[1]);
      continue;
    }
    parts.push(piece);
  }
  return parts;
}

function comparePart(left, right) {
  const leftNumber = /^\d+$/.test(left);
  const rightNumber = /^\d+$/.test(right);
  if (leftNumber && rightNumber) return Number(left) - Number(right);
  if (leftNumber) return -1;
  if (rightNumber) return 1;
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function compareVersions(left, right) {
  if (left.major !== right.major) return left.major - right.major;
  if (left.minor !== right.minor) return left.minor - right.minor;
  if (left.patch !== right.patch) return left.patch - right.patch;
  if (left.pre.length === 0 && right.pre.length === 0) return 0;
  if (left.pre.length === 0) return 1;
  if (right.pre.length === 0) return -1;
  const length = Math.max(left.pre.length, right.pre.length);
  for (let index = 0; index < length; index += 1) {
    if (left.pre[index] === undefined) return -1;
    if (right.pre[index] === undefined) return 1;
    const difference = comparePart(left.pre[index], right.pre[index]);
    if (difference !== 0) return difference;
  }
  return 0;
}

const oldChartFloor = parseVersion("0.30.0");
const firstStable = parseVersion("1.0.0");

export function selectChartVersion(tags) {
  const versions = tags.map(parseVersion).filter((version) => version && compareVersions(version, oldChartFloor) > 0);
  const stable = versions.filter((version) => version.pre.length === 0 && compareVersions(version, firstStable) >= 0);
  const pool = stable.length > 0 ? stable : versions.filter((version) => version.pre.length > 0);
  if (pool.length === 0) {
    throw new Error("No published SuperPlane chart is newer than 0.30.0");
  }
  pool.sort(compareVersions);
  return pool[pool.length - 1].chartVersion;
}

export function componentReleasesFromValues(yaml) {
  const block = /^componentReleases:\n((?:[ \t].*\n)*)/m.exec(yaml);
  if (!block) {
    throw new Error("componentReleases is missing from the SuperPlane chart");
  }
  const runner = /^  runnerVersion:\s*(\S+)\s*$/m.exec(block[1]);
  const fleetManager = /^  fleetManagerVersion:\s*(\S+)\s*$/m.exec(block[1]);
  if (!runner || !COMPONENT_VERSION_RE.test(runner[1])) {
    throw new Error("runnerVersion is missing from the SuperPlane chart");
  }
  if (!fleetManager || !COMPONENT_VERSION_RE.test(fleetManager[1])) {
    throw new Error("fleetManagerVersion is missing from the SuperPlane chart");
  }
  return {
    runnerVersion: runner[1],
    fleetManagerVersion: fleetManager[1],
    fleetManagerChartVersion: fleetManager[1].replace(/^v/, ""),
  };
}

export function readTarFile(tar, want) {
  let offset = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const size = Number.parseInt(header.subarray(124, 136).toString("utf8").replace(/\0/g, "").trim(), 8);
    if (!Number.isFinite(size) || size < 0) {
      throw new Error(`Chart archive has an invalid size for ${name || "an entry"}`);
    }
    const dataStart = offset + 512;
    if (name === want) return tar.subarray(dataStart, dataStart + size).toString("utf8");
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  throw new Error(`Chart archive has no ${want}`);
}

export function chartRelease(chartVersion, components) {
  return {
    chartVersion,
    imageTag: chartVersion.startsWith("v") ? chartVersion : `v${chartVersion}`,
    token: TOKEN,
    fleetManagerVersion: components.fleetManagerVersion,
    fleetManagerChartVersion: components.fleetManagerChartVersion,
    fleetManagerToken: FLEET_MANAGER_TOKEN,
    fleetManagerChartToken: FLEET_MANAGER_CHART_TOKEN,
    runnerVersion: components.runnerVersion,
    runnerToken: RUNNER_TOKEN,
  };
}

function assertSelection() {
  const old = ["0.26.0", "0.30.0", "0.0.0-782e528cea1fd707313bcfa4a2e8f57e9148f5c5"];
  if (selectChartVersion([...old, "1.0.0-rc1"]) !== "1.0.0-rc1") throw new Error("rc1");
  if (selectChartVersion([...old, "1.0.0-rc1", "1.0.0-rc2"]) !== "1.0.0-rc2") throw new Error("rc2");
  if (selectChartVersion([...old, "1.0.0-rc2", "1.0.0"]) !== "1.0.0") throw new Error("stable");
  if (selectChartVersion(["1.0.0", "1.1.0-rc1", "1.1.0"]) !== "1.1.0") throw new Error("newer stable");
  if (selectChartVersion(["0.31.0", "1.0.0-rc1"]) !== "1.0.0-rc1") throw new Error("ignore pre-v1 stable");
  if (selectChartVersion(["1.0.0-rc4", "1.0.0-rc10"]) !== "1.0.0-rc10") throw new Error("rc10");
  if (selectChartVersion(["1.0.0", "1.2.0-rc1"]) !== "1.0.0") throw new Error("stable hides later rc");

  const values = [
    "componentReleases:",
    "  runnerVersion: v0.2.0",
    "  runnerVersions:",
    "    - v0.2.0",
    "    - v9.9.9",
    "  fleetManagerVersion: v0.1.4",
    "",
    "sentry:",
    "",
  ].join("\n");
  const components = componentReleasesFromValues(values);
  if (components.runnerVersion !== "v0.2.0") throw new Error("runner pin");
  if (components.fleetManagerVersion !== "v0.1.4") throw new Error("fleet manager pin");
  if (components.fleetManagerChartVersion !== "0.1.4") throw new Error("fleet manager chart pin");
  const packed = packTarFile(VALUES_PATH, values);
  if (componentReleasesFromValues(readTarFile(packed, VALUES_PATH)).runnerVersion !== "v0.2.0") {
    throw new Error("chart archive");
  }
}

function packTarFile(name, contents) {
  const data = Buffer.from(contents);
  const header = Buffer.alloc(512);
  header.write(name, 0, 100, "utf8");
  header.write("0000644\0", 100, 8, "utf8");
  header.write("0000000\0", 108, 8, "utf8");
  header.write("0000000\0", 116, 8, "utf8");
  header.write(data.length.toString(8).padStart(11, "0") + "\0", 124, 12, "utf8");
  header.write("00000000000\0", 136, 12, "utf8");
  header.write("        ", 148, 8, "utf8");
  header.write("0", 156, 1, "utf8");
  let checksum = 0;
  for (const byte of header) checksum += byte;
  header.write(checksum.toString(8).padStart(6, "0") + "\0 ", 148, 8, "utf8");
  const padding = Buffer.alloc(Math.ceil(data.length / 512) * 512 - data.length);
  return Buffer.concat([header, data, padding, Buffer.alloc(1024)]);
}

async function ghcrToken() {
  const tokenResponse = await fetch(`https://ghcr.io/token?scope=repository:${CHART_REPO}:pull`);
  if (!tokenResponse.ok) throw new Error(`GHCR token request failed: ${tokenResponse.status}`);
  const { token } = await tokenResponse.json();
  if (!token) throw new Error("GHCR token request returned no token");
  return token;
}

async function listTags(token) {
  const tags = [];
  let url = `https://ghcr.io/v2/${CHART_REPO}/tags/list?n=1000`;
  while (url) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`GHCR tag list failed: ${response.status}`);
    const body = await response.json();
    tags.push(...(body.tags ?? []));
    const link = response.headers.get("link") ?? "";
    const next = /<([^>]+)>;\s*rel="next"/.exec(link);
    url = next ? next[1] : "";
  }
  return tags;
}

async function componentReleasesForChart(token, chartVersion) {
  const manifestResponse = await fetch(`https://ghcr.io/v2/${CHART_REPO}/manifests/${chartVersion}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.oci.image.manifest.v1+json",
    },
  });
  if (!manifestResponse.ok) throw new Error(`GHCR chart manifest failed: ${manifestResponse.status}`);
  const manifest = await manifestResponse.json();
  const layer = (manifest.layers ?? []).find((item) => String(item.mediaType).includes("helm.chart.content"));
  if (!layer?.digest) throw new Error("Helm chart layer is missing");
  const blobResponse = await fetch(`https://ghcr.io/v2/${CHART_REPO}/blobs/${layer.digest}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!blobResponse.ok) throw new Error(`GHCR chart blob failed: ${blobResponse.status}`);
  const archive = gunzipSync(Buffer.from(await blobResponse.arrayBuffer()));
  return componentReleasesFromValues(readTarFile(archive, VALUES_PATH));
}

function writeRelease(chartVersion, components) {
  const release = chartRelease(chartVersion, components);
  mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(release, null, 2)}\n`);
  console.log(
    `SuperPlane chart ${release.chartVersion} supports Fleet Manager ${release.fleetManagerVersion} and Runner ${release.runnerVersion}`,
  );
}

if (process.argv.includes("--self-test")) {
  assertSelection();
  console.log("selection checks passed");
} else {
  try {
    const token = await ghcrToken();
    const tags = await listTags(token);
    const chartVersion = selectChartVersion(tags);
    writeRelease(chartVersion, await componentReleasesForChart(token, chartVersion));
  } catch (error) {
    if (process.argv.includes("--require")) {
      console.error(error.message);
      process.exit(1);
    }
    try {
      const current = JSON.parse(readFileSync(OUTPUT, "utf8"));
      console.warn(`Kept ${current.chartVersion}. Chart lookup failed: ${error.message}`);
    } catch {
      console.error(error.message);
      process.exit(1);
    }
  }
}
