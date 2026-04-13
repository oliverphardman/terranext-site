export const GITHUB_URL = "https://github.com/oliverphardman/terraform-aws-opennext";
export const REGISTRY_URL = "https://registry.terraform.io/modules/oliverphardman/opennext/aws";

export const QUICK_START_BUILD = `npx @opennextjs/aws@latest build`;

export const QUICK_START_TF = `module "terranext" {
  source = "oliverphardman/opennext/aws"

  name               = "My Website"
  slug               = "my-website"
  aws_region         = "us-east-1"
  opennext_build_path = "../.open-next"

  deployment_domain = "example.com"
  acm_arn           = aws_acm_certificate.cert.arn
  hosted_zone_id    = data.aws_route53_zone.main.zone_id
}`;

export const COMPARISONS = [
	{
		name: "Vercel",
		pros: ["Best support for Next.js", "Fastest to setup", "Free tier for hobby projects"],
		cons: ["Expensive once you scale", "No infrastructure control", "Not free for GitHub organizations"],
	},
	{
		name: "Amplify",
		pros: ["Hosted on AWS", "Managed service, minimal ops work", "Pay-as-you-go AWS pricing"],
		cons: [
			"Next.js feature support can lag behind",
			"Limited infrastructure customization",
			"Poor developer experience",
			"Offering is confusing and bloated",
		],
	},
	{
		name: "OpenNext with SST",
		pros: ["Highly cost-effective", "First-class OpenNext support", "Easy to learn and use"],
		cons: [
			"Difficult to customize infrastructure beyond SST's batteries-included setup",
			"Needs somewhere to run",
			"You are responsible for maintenance",
		],
	},
	{
		name: "TerraNext",
		pros: [
			"Full control over every resource",
			"Highly cost-effective",
			"Manage your infrastructure with code",
			"Great if you have other infrastructure",
		],
		cons: [
			"More complex",
			"Requires a Terraform state",
			"Needs somewhere to run",
			"You are responsible for maintenance",
		],
	},
];
