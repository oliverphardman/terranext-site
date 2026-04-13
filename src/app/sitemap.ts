import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://terranext.dev",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}
