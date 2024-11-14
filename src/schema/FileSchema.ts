import { z } from 'zod';

export const schema = z.object({
    title: z.string(),
    id: z.string(),
    url: z.string(),
    size: z.number(),
    type: z.string(),
    shareLink: z.null(),
    userId: z.string(),
    thumbnailPath: z.null(),
    createdAt: z.string(),
    updatedAt: z.string(),
    fileType: z.string(),
    viewCount: z.number(),
    lastViewAt: z.null(),
    displayOrder: z.number(),
    FileTag: z.array(
        z.object({
            id: z.string(),
            fileId: z.string(),
            tagId: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
            tag: z.object({
                id: z.string(),
                name: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
            }),
        })
    ),
});

export type FileModel = z.infer<typeof schema>;
