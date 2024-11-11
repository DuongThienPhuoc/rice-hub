import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nguyên liệu',
    description: 'Nguyên liệu',
};

export default function ProductLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
