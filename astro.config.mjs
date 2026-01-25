// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

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
					label: 'Installation',
					items: [
						{ label: 'Overview', slug: 'installation/overview' },
						{ label: 'Try it on your computer', slug: 'installation/local' },
						{ label: 'EC2 on AWS', slug: 'installation/single-host/aws-ec2' },
						{ label: 'Compute Engine on GCP', slug: 'installation/single-host/gcp-compute-engine' },
						{ label: 'Hetzner', slug: 'installation/single-host/hetzner' },
						{ label: 'DigitalOcean', slug: 'installation/single-host/digitalocean' },
						{ label: 'Linode', slug: 'installation/single-host/linode' },
						{ label: 'Generic server', slug: 'installation/single-host/generic-server' },
						{ label: 'Google Kubernetes Engine', slug: 'installation/kubernetes/gke' },
						{ label: 'Amazon Kubernetes (EKS)', slug: 'installation/kubernetes/amazon-eks' },
					],
				},
				{
					label: 'Components & Triggers',
					autogenerate: { directory: 'integrations' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
