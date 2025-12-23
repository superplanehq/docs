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
						{ label: 'Try it on your computer', slug: 'installation/local' },
						{
							label: 'Single Host Installation',
							items: [
								{ label: 'Hetzner', slug: 'installation/single-host/hetzner' },
								{ label: 'DigitalOcean', slug: 'installation/single-host/digitalocean' },
								{ label: 'Heroku', slug: 'installation/single-host/heroku' },
								{ label: 'EC2 on AWS', slug: 'installation/single-host/aws-ec2' },
								{ label: 'Compute Engine on GCP', slug: 'installation/single-host/gcp-compute-engine' },
								{ label: 'Generic server', slug: 'installation/single-host/generic-server' },
							],
						},
						{
							label: 'Kubernetes',
							items: [
								{ label: 'Google Kubernetes Engine', slug: 'installation/kubernetes/gke' },
								{ label: 'Amazon Kubernetes (EKS)', slug: 'installation/kubernetes/amazon-eks' },
								{ label: 'Generic Kubernetes cluster', slug: 'installation/kubernetes/generic-cluster' },
							],
						},
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
