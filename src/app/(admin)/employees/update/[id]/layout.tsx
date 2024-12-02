import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chỉnh sửa thông tin nhân viên',
    description: 'Chỉnh sửa thông tin nhân viên',
};

export default function UpdateEmployeePageLayout({
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
