'use client'

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-background text-foreground'>
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-8">Oops! Không tìm thấy trang</h2>
            <p className="text-lg mb-8 text-center max-w-md">
                Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link href="/">
                <Button className="flex items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Quay lại trang chủ
                </Button>
            </Link>
        </div>
    );
}
