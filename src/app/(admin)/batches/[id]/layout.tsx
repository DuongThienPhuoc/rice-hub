import React from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import BatchDetailPageBreadcrumb from './breadcrumb';

export const metadata: Metadata = {
    title: 'Chi tiết lô hàng',
    description: 'Chi tiết lô hàng',
};

export default function BatchDetailPageLayout({
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
                <BatchDetailPageBreadcrumb batchId={params.id} />
            </header>
            {children}
        </>
    );
}
