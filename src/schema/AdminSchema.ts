import { z } from 'zod';

export const AdminData = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    dob: z.null(),
    mobile: z.string(),
    username: z.string(),
    email: z.string(),
    photo: z.null(),
    joinedDate: z.string(),
    lastLogin: z.null(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deleted: z.boolean(),
    deletedBy: z.null(),
    deletedAt: z.null(),
    roles: z.array(
        z.object({
            roleId: z.number(),
            adminId: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
            role: z.object({
                id: z.number(),
                name: z.string(),
                displayName: z.string(),
                slug: z.string(),
                description: z.string(),
                isActive: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string()
            })
        })
    )
});

export type AdminModel = z.infer<typeof AdminData>;
