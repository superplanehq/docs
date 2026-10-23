// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";
import starlightImageZoom from "starlight-image-zoom";
import { sidebar } from "./src/config/sidebar.mjs";
import { superplaneChartVersion } from "./scripts/remark-superplane-chart.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.superplane.com",
  markdown: {
    remarkPlugins: [superplaneChartVersion],
  },
  redirects: {
    "/": "/get-started/overview",
  },
  integrations: [
    mermaid({ autoTheme: true }),
    starlight({
      plugins: [starlightImageZoom()],
      title: "SuperPlane Factory Docs",
      customCss: ["./src/styles/custom.css", "./src/styles/branding.css"],
      editLink: {
        base: "https://github.com/superplanehq/docs/edit/main/",
      },
      lastUpdated: true,
      logo: {
        src: "./src/assets/superplane-logo.svg",
        alt: "",
      },
      components: {
        Head: "./src/components/CustomHead.astro",
        Header: "./src/components/CustomHeader.astro",
        ContentPanel: "./src/components/CustomContentPanel.astro",
        SiteTitle: "./src/components/CustomSiteTitle.astro",
        SocialIcons: "./src/components/CustomSocialIcons.astro",
        PageTitle: "./src/components/CustomPageTitle.astro",
        TableOfContents: "./src/components/CustomTableOfContents.astro",
        Footer: "./src/components/CustomFooter.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/superplanehq/docs",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.superplane.com",
        },
      ],
      sidebar,
    }),
  ],
});
