import React from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import OrderDetailPageBreadcrumb from '@/app/(admin)/admin/orders/[id]/breadcrumb';

export const metadata: Metadata = {
    title: 'Chi tiết đơn hàng',
    description: 'Chi tiết đơn hàng',
};

export default function OrderPageLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: {
        id: string;
    };
}) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <OrderDetailPageBreadcrumb orderID={params.id} />
            </header>
            {children}
        </>
    );
}
