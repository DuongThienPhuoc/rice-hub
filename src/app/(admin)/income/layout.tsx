import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Phiếu thu',
    description: 'Phiếu thu',
};

export default function IncomeLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
