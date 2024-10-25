import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email không hợp lệ' })
        .email({ message: 'Email không hợp lệ' })
});
