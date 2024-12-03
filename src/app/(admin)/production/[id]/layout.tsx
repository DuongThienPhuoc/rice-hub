import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết phiếu sản xuất',
    description: 'Chi tiết phiếu sản xuất',
};

export default function ProductionDetailPageLayout({
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
