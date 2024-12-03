import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chỉnh sửa thông tin nguyên liệu',
    description: 'Chỉnh sửa thông tin nguyên liệu',
};

export default function UpdateProductPageLayout({
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
