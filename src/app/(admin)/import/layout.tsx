import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu nhập',
    description: 'Phiếu nhập',
};

export default function ImportLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
