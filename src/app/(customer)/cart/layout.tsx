import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giỏ hàng',
    description: 'Giỏ hàng',
};

export default function CartLayout({ children }: { children: ReactNode }) {
    return (
        <>
           {children}
        </>
    );
}
