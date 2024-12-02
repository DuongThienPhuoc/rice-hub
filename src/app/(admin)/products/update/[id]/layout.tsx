import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chỉnh sửa thông tin sản phẩm',
    description: 'Chỉnh sửa thông tin sản phẩm',
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
