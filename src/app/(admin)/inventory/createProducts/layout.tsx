import React from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import CreateImportPageBreadcrumb from './breadcrumb';

export const metadata: Metadata = {
    title: 'Thêm phiếu kiểm kho sản phẩm mới',
    description: 'Thêm phiếu kiểm kho sản phẩm mới',
};

export default function CreateInventoryPageLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CreateImportPageBreadcrumb />
            </header>
            {children}
        </>
    );
}