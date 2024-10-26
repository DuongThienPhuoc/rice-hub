import React from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import CustomerDetailPageBreadcrumb from './breadcrumb';

export const metadata: Metadata = {
    title: 'Chi tiết khách hàng',
    description: 'Chi tiết khách hàng',
};

export default function CustomerDetailPageLayout({
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
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CustomerDetailPageBreadcrumb customerId={params.id} />
            </header>
            {children}
        </>
    );
}
