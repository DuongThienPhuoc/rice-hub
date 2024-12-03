import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm phiếu kiểm kho sản phẩm mới',
    description: 'Thêm phiếu kiểm kho sản phẩm mới',
};

export default function CreateInventoryPageLayout({
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
