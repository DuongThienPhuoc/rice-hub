import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu xuất kho',
    description: 'Phiếu xuất kho',
};

export default function ExportLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
