import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm sản phẩm mới',
    description: 'Thêm sản phẩm mới',
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
