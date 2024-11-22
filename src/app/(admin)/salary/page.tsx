import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import SalaryPageBreadcrumb from '@/app/(admin)/salary/breadcrumb';
import SalaryPage from '@/app/(admin)/salary/salary-page';

export default function Page() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <SalaryPageBreadcrumb />
            </header>
            <SalaryPage />
        </>
    );
}
