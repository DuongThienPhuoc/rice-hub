import { Metadata } from 'next';
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AdminOrdersPageBreadcrumb from '@/app/(admin)/admin/orders/breadcrumb';

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
