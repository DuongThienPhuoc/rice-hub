import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu nhập/xuất',
    description: 'Phiếu nhập/xuất',
};

export default function ReceiptLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
