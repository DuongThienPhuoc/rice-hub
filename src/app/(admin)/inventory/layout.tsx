import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu kiểm kho',
    description: 'Phiếu kiểm kho',
};

export default function InventoryLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
