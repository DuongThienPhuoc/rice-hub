import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu sản xuất',
    description: 'Phiếu sản xuất',
};

export default function ProductionLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
