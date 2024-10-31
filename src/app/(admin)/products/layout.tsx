import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sản phẩm',
    description: 'Sản phẩm',
};

export default function ProductLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
