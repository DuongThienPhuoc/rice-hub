import React from 'react';
import { Metadata } from 'next';
import { SidebarTriggerCommon } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import OrderHistoryPageBreadcrumb from '@/app/(customer)/order/history/breadcrumb';

export const metadata: Metadata = {
    title: 'Lịch sử đơn hàng',
    description: 'Lịch sử đơn hàng',
};

export default function OrderPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTriggerCommon />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <OrderHistoryPageBreadcrumb />
            </header>
            {children}
        </>
    );
}
