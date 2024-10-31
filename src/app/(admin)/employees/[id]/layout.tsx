import React from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import EmployeeDetailPageBreadcrumb from './breadcrumb';

export const metadata: Metadata = {
    title: 'Chi tiết nhân viên',
    description: 'Chi tiết nhân viên',
};

export default function EmployeeDetailPageLayout({
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
                <EmployeeDetailPageBreadcrumb employeeId={params.id} />
            </header>
            {children}
        </>
    );
}
