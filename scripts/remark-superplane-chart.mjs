import { readFileSync } from "node:fs";

const releaseUrl = new URL("../src/data/superplane-chart.json", import.meta.url);

function visit(node, fn) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}

const imageToken = "@@SUPERPLANE_IMAGE_TAG@@";

function replaceToken(value, token, replacement) {
  if (!token || replacement == null || replacement === "") return value;
  if (!value.includes(token)) return value;
  return value.replaceAll(token, replacement);
}

export function superplaneChartVersion() {
  const release = JSON.parse(readFileSync(releaseUrl, "utf8"));
  const token = release.token ?? "@@SUPERPLANE_CHART_VERSION@@";
  const replacements = [
    [release.fleetManagerChartToken ?? "@@FLEET_MANAGER_CHART_VERSION@@", release.fleetManagerChartVersion],
    [release.fleetManagerToken ?? "@@FLEET_MANAGER_VERSION@@", release.fleetManagerVersion],
    [release.runnerToken ?? "@@RUNNER_VERSION@@", release.runnerVersion],
    [token, release.chartVersion],
    [imageToken, release.imageTag],
  ];
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "text" && node.type !== "code" && node.type !== "inlineCode") return;
      if (!node.value) return;
      for (const [name, replacement] of replacements) {
        node.value = replaceToken(node.value, name, replacement);
      }
    });
  };
}
