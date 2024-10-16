import { ReactNode } from 'react';
import Navbar from '@/components/navbar/navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giỏ hàng',
    description: 'Giỏ hàng',
};

export default function CartLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            <Navbar />
            <section className="container mx-auto">{children}</section>
        </main>
    );
}
