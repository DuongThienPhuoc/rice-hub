import React from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import CreateExportPageBreadcrumb from './breadcrumb';

export const metadata: Metadata = {
    title: 'Thêm phiếu xuất kho mới',
    description: 'Thêm phiếu xuất kho mới',
};

export default function CreateExportPageLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CreateExportPageBreadcrumb />
            </header>
            {children}
        </>
    );
}