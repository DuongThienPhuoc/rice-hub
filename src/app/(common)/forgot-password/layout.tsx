import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quên mật khẩu',
    description: 'Quên mật khẩu',
};

export default function ForgotPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <section className="flex items-center justify-center min-h-screen">
                {children}
            </section>
        </main>
    );
}
