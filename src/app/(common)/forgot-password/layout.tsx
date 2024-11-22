import React from 'react';
import { Metadata } from 'next';
import Background from '@/components/assets/img/background.jpg'

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
            <section className="relative flex items-center justify-center min-h-screen">
                <div
                    className='absolute inset-0 bg-cover bg-center'
                    style={{
                        backgroundImage: `url(${Background.src})`,
                        transform: 'scaleX(-1)',
                    }}
                />
                {children}
            </section>
        </main>
    );
}
