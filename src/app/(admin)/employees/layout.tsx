import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Khách hàng',
    description: 'Khách hàng',
};

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
