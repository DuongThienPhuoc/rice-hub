import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu chi',
    description: 'Phiếu chi',
};

export default function ExpenseLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
