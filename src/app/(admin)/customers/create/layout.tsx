import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thêm khách hàng mới',
    description: 'Thêm khách hàng mới',
};

export default function CreateCustomerPageLayout({
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
