import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu nhập kho',
    description: 'Phiếu nhập kho',
};

export default function ImportLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
