import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm phiếu xuất kho mới',
    description: 'Thêm phiếu xuất kho mới',
};

export default function CreateExportPageLayout({
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
