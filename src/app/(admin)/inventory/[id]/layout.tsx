import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết phiếu kiểm kho',
    description: 'Chi tiết phiếu kiểm kho',
};

export default function InventoryDetailPageLayout({
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
