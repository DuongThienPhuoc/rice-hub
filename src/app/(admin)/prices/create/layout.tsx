import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm bảng giá mới',
    description: 'Thêm bảng giá mới',
};

export default function CreatePricePageLayout({
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
