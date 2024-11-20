import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nhân viên',
    description: 'Nhân viên',
};

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
