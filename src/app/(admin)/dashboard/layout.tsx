import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý tài chính',
    description: 'Quản lý tài chính',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
