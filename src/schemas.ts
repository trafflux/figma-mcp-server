import { z } from 'zod';

export const fileIdSchema = z.object({
    method: z.literal('figma/files/get'),
    params: z.object({
        fileId: z.string()
    })
});

export const fileExportSchema = z.object({
    method: z.literal('figma/files/export'),
    params: z.object({
        fileId: z.string(),
        format: z.string().optional(),
        scale: z.number().optional()
    })
});

export const componentSchema = z.object({
    method: z.literal('figma/components/get'),
    params: z.object({
        fileId: z.string(),
        nodeId: z.string()
    })
});

export const teamComponentsSchema = z.object({
    method: z.literal('figma/team/components'),
    params: z.object({
        teamId: z.string()
    })
});

// Add other schemas here for each endpoint
