import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu xuất',
    description: 'Phiếu xuất',
};

export default function ExportLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
