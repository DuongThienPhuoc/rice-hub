import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm phiếu kiểm kho nguyên liệu mới',
    description: 'Thêm phiếu kiểm kho nguyên liệu mới',
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
