import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chỉnh sửa thông tin khách hàng',
    description: 'Chỉnh sửa thông tin khách hàng',
};

export default function UpdateCustomerPageLayout({
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
