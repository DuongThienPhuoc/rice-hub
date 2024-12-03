import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm nhân viên mới',
    description: 'Thêm nhân viên mới',
};

export default function CreateEmployeePageLayout({
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
