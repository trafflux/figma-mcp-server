import { z } from 'zod';

export const FigmaUriSchema = z.string().regex(/^figma:\/\/\/(file|component|variable)\/[\w-]+(\/[\w-]+)?$/);

export const ResourceSchema = z.object({
  uri: FigmaUriSchema,
  type: z.enum(['file', 'component', 'variable']),
  name: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const ListResourcesResponseSchema = z.object({
  resources: z.array(ResourceSchema)
});

export const ReadResourceRequestSchema = z.object({
  uri: FigmaUriSchema
});

export const SearchResourcesRequestSchema = z.object({
  query: z.string()
});

export const WatchResourceRequestSchema = z.object({
  uri: FigmaUriSchema
});