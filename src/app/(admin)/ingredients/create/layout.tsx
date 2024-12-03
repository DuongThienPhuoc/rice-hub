import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm nguyên liệu mới',
    description: 'Thêm nguyên liệu mới',
};

export default function CreateProductPageLayout({
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
