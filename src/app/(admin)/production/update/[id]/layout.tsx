import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chỉnh sửa thông tin phiếu kiểm kho',
    description: 'Chỉnh sửa thông tin phiếu kiểm kho',
};

export default function UpdateProductionPageLayout({
    children,
}: {
    children: React.ReactNode,
    params: {
        id: string;
    };
}) {
    return (
        <>
            {children}
        </>
    );
}
