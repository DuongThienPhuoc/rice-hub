import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nhà cung cấp',
    description: 'Nhà cung cấp',
};

export default function SupplierLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
