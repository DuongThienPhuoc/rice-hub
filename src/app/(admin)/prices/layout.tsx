import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bảng giá',
    description: 'Bảng giá',
};

export default function PriceLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
