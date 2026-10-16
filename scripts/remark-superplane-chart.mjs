import { readFileSync } from "node:fs";

const releaseUrl = new URL("../src/data/superplane-chart.json", import.meta.url);

function visit(node, fn) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}

export function superplaneChartVersion() {
  const release = JSON.parse(readFileSync(releaseUrl, "utf8"));
  const token = release.token ?? "@@SUPERPLANE_CHART_VERSION@@";
  return (tree) => {
    visit(tree, (node) => {
      if ((node.type === "text" || node.type === "code" || node.type === "inlineCode") && node.value?.includes(token)) {
        node.value = node.value.replaceAll(token, release.chartVersion);
      }
    });
  };
}
