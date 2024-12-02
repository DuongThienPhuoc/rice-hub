import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm phiếu sản xuất mới',
    description: 'Thêm phiếu sản xuất mới',
};

export default function CreateProductionPageLayout({
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
