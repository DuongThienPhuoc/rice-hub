import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nhà sản xuất',
    description: 'Nhà sản xuất',
};

export default function SupplierLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
