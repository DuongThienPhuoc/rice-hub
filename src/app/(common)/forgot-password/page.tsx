'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mails, Phone } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    return (
        <Card className="w-full max-w-xl">
            <CardHeader className="space-y-1">
                <CardTitle className='text-[44px]'>Quên mật khẩu</CardTitle>
                <CardDescription className='text-[16px]'>
                    Chọn phương thức khôi phục mật khẩu
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Card
                    className="transition duration-150 hover:cursor-pointer hover:scale-105"
                    onClick={() => router.push('/forgot-password/email')}
                >
                    <CardContent className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Mails className="h-5 w-5" />
                            <h1 className="font-semibold text-lg">
                                Khôi phục bằng email
                            </h1>
                        </div>
                        <ArrowRight className="h-5 w-5" />
                    </CardContent>
                </Card>
                <Card className="transition duration-150 hover:cursor-pointer hover:scale-105">
                    <CardContent className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            <h1 className="font-semibold text-lg">
                                Khôi phục bằng số điện thoại
                            </h1>
                        </div>
                        <ArrowRight className="h-5 w-5" />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}