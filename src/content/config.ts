import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
		status: z.string().optional(),
		originalUrl: z.string().optional(),
	}),
});

const pages = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		parent: z.number().optional(),
		menuOrder: z.number().optional(),
	}),
});

export const collections = {
	'blog': blog,
	'pages': pages,
};
