import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết sản phẩm',
    description: 'Chi tiết sản phẩm',
};

export default function ProductDetailPageLayout({
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
