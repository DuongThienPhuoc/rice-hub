import { z } from 'zod';

export const loginFormSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, { message: 'Số điện thoại không hợp lệ' })
        .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
            message: 'Số điện thoại không hợp lệ',
        }),
});

export const otpFormSchema = z.object({
    otp: z
        .string()
        .min(6, { message: 'Mã OTP không hợp lệ' })
        .max(6, { message: 'Mã OTP không hợp lệ' })
        .regex(/^[0-9]{6}$/, { message: 'Mã OTP không hợp lệ' }),
});