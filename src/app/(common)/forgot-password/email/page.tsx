'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPasswordFormSchema } from '@/schema/forgot-password';
import { z } from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { forgotPassword } from '@/data/forgot-password';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';

export default function ForgotPasswordEmailPage() {
    const router = useRouter();
    const [onPageChange, setOnPageChange] = useState(false);
    const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: '',
        },
    });
    const [isPending, startTransition] = useTransition();

    function handleSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
        startTransition(async () => {
            try {
                const response = await forgotPassword(values);
                if (response.status === 200) {
                    router.push('/login');
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Thất bại',
                        description: 'Đã có lỗi xảy ra, vui lòng thử lại',
                        duration: 3000
                    });
                }
            } catch (e) {
                console.error(e);
                toast({
                    variant: 'destructive',
                    title: 'Thất bại',
                    description: 'Đã có lỗi xảy ra, vui lòng thử lại',
                    duration: 3000
                });
            }
        });
    }

    return (
        <Card className="w-full max-w-md z-10">
            <CardHeader className="space-y-1">
                <CardTitle>Quên mật khẩu</CardTitle>
                <CardDescription>
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn mật
                    khẩu mới.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="email" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="abc@gmail.com"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="email"
                        />
                    </form>
                </Form>
                <div></div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button
                    form="email"
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                >
                    Đặt lại mật khẩu
                </Button>
                <div className="text-sm text-center text-gray-500">
                    <span>Bạn đã nhớ lại mật khẩu? </span>
                    <Link
                        href="/login"
                        className="text-blue-500 hover:underline"
                        onClick={() => setOnPageChange(true)}
                    >
                        Quay lại đăng nhập
                    </Link>
                </div>
            </CardFooter>
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0  left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
