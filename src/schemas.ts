import { z } from 'zod';

export const FigmaUriSchema = z.string().regex(/^figma:\/\/\/(file|component|variable)\/[\w-]+(\/[\w-]+)?$/);

export const ResourceSchema = z.object({
  uri: FigmaUriSchema,
  type: z.enum(['file', 'component', 'variable']),
  name: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const ListResourcesRequestSchema = z.object({
  method: z.literal('resources/list')
});

export const ListResourcesResponseSchema = z.object({
  resources: z.array(ResourceSchema)
});

export const ReadResourceRequestSchema = z.object({
  method: z.literal('resources/read'),
  params: z.object({
    uri: FigmaUriSchema
  })
});

export const ReadResourceResponseSchema = z.object({
  contents: z.array(z.object({
    uri: z.string(),
    mimeType: z.string(),
    text: z.string()
  }))
});

export const SearchResourcesRequestSchema = z.object({
  method: z.literal('resources/search'),
  params: z.object({
    query: z.string()
  })
});

export const WatchResourceRequestSchema = z.object({
  method: z.literal('resources/watch'),
  params: z.object({
    uri: FigmaUriSchema
  })
});