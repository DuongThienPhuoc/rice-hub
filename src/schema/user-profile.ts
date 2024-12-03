'use client';

import { z } from 'zod';

export const UserProfileFormSchema = z.object({
    fullName: z.string().min(1).max(255),
    userName: z.string().min(1).max(255),
    phoneNumber: z.string().min(10).max(255),
    email: z.string().email(),
    address: z.string().min(1).max(255),
});
