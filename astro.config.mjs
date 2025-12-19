// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'SuperPlane Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/superplanehq/docs' }],
			sidebar: [
				{
					label: 'Get Started',
					items: [
						{ label: 'Welcome', slug: '' },
						// Each item here is one entry in the navigation menu.
						{ label: 'Quickstart', slug: 'get-started/quickstart' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
