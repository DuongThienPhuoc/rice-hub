import type { Metadata } from 'next';
import React from 'react';
import app from '@/api/firebaseConfig'

export const metadata: Metadata = {
    title: 'Đăng nhập',
};

export default function PhoneLoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main>
        <section className="flex items-center justify-center min-h-screen">
            {children}
        </section>
    </main>;
}
