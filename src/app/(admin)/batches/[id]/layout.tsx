import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết lô hàng',
    description: 'Chi tiết lô hàng',
};

export default function BatchDetailPageLayout({
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
