import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết khách hàng',
    description: 'Chi tiết khách hàng',
};

export default function CustomerDetailPageLayout({
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
