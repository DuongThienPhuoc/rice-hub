'use client';

import { z } from 'zod';

export const userProfileFormSchema = z.object({
    fullName: z.string().min(1).max(255),
    userName: z.string().min(1).max(255),
    phoneNumber: z.string().min(10).max(255),
    email: z.string().email(),
});
