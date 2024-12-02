import React from 'react';
import { SidebarProvider, SidebarTriggerCommon } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import BreadCrumbDisplay from '@/components/breadcrumb/bread-crumb-display';
import NotificationButton from '@/components/notification/notification-button';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 mb-5">
                    <div className='flex items-center'>
                        <SidebarTriggerCommon />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <BreadCrumbDisplay/>
                    </div>
                    <div>
                        <NotificationButton />
                    </div>
                </header>
                {children}
            </main>
        </SidebarProvider>
    );
}
