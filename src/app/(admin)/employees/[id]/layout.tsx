import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết nhân viên',
    description: 'Chi tiết nhân viên',
};

export default function EmployeeDetailPageLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            {children}
        </>
    );
}
