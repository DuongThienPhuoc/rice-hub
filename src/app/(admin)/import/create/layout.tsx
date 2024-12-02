import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm phiếu nhập kho mới',
    description: 'Thêm phiếu nhập kho mới',
};

export default function CreateImportPageLayout({
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
