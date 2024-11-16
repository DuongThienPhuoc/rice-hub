import { z } from 'zod';

export const paymentVoucherSchema = z.object({
    type: z.string().min(1, {message: 'Loại không được để trống'}),
    totalAmount: z.string().min(1, {message: 'Số tiền không được để trống'}),
    note: z.string(),
});
