import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Đơn hàng',
};

export default function AdminOrderPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
