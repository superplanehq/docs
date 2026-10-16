import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CHART_REPO = "superplanehq/superplane-chart";
const OUTPUT = new URL("../src/data/superplane-chart.json", import.meta.url);
const VERSION_RE = /^v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-(?<pre>[0-9A-Za-z.-]+))?$/;
const TOKEN = "@@SUPERPLANE_CHART_VERSION@@";

function parseVersion(tag) {
  const match = VERSION_RE.exec(tag);
  if (!match?.groups) return null;
  const { major, minor, patch, pre } = match.groups;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    pre: pre ? pre.split(".") : [],
    chartVersion: `${major}.${minor}.${patch}${pre ? `-${pre}` : ""}`,
  };
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

export function chartRelease(chartVersion) {
  return {
    chartVersion,
    imageTag: chartVersion.startsWith("v") ? chartVersion : `v${chartVersion}`,
    token: TOKEN,
  };
}

function assertSelection() {
  const old = ["0.26.0", "0.30.0", "0.0.0-782e528cea1fd707313bcfa4a2e8f57e9148f5c5"];
  if (selectChartVersion([...old, "1.0.0-rc1"]) !== "1.0.0-rc1") throw new Error("rc1");
  if (selectChartVersion([...old, "1.0.0-rc1", "1.0.0-rc2"]) !== "1.0.0-rc2") throw new Error("rc2");
  if (selectChartVersion([...old, "1.0.0-rc2", "1.0.0"]) !== "1.0.0") throw new Error("stable");
  if (selectChartVersion(["1.0.0", "1.1.0-rc1", "1.1.0"]) !== "1.1.0") throw new Error("newer stable");
  if (selectChartVersion(["0.31.0", "1.0.0-rc1"]) !== "1.0.0-rc1") throw new Error("ignore pre-v1 stable");
}

async function listTags() {
  const tokenResponse = await fetch(`https://ghcr.io/token?scope=repository:${CHART_REPO}:pull`);
  if (!tokenResponse.ok) throw new Error(`GHCR token request failed: ${tokenResponse.status}`);
  const { token } = await tokenResponse.json();
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

function writeRelease(chartVersion) {
  const release = chartRelease(chartVersion);
  mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(release, null, 2)}\n`);
  console.log(`SuperPlane chart ${release.chartVersion} (image ${release.imageTag})`);
}

if (process.argv.includes("--self-test")) {
  assertSelection();
  console.log("selection checks passed");
} else {
  try {
    const tags = await listTags();
    writeRelease(selectChartVersion(tags));
  } catch (error) {
    try {
      const current = JSON.parse(readFileSync(OUTPUT, "utf8"));
      console.warn(`Kept ${current.chartVersion}. Chart lookup failed: ${error.message}`);
    } catch {
      console.error(error.message);
      process.exit(1);
    }
  }
}
