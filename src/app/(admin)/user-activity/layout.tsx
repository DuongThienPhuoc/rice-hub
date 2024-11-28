import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import UserActivityPageBreadcrumb from '@/app/(admin)/user-activity/breadcrumb';

export default function UserActivityLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <UserActivityPageBreadcrumb />
            </header>
            <section>
                <div className='container mx-auto'>
                    {children}
                </div>
            </section>
        </>
    );
}
