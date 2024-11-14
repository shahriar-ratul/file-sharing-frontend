import { z } from 'zod';

export const UserData = z.object({
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
});

export type UserModel = z.infer<typeof UserData>;
