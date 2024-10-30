import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar/app-sidebar';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                {children}
            </main>
        </SidebarProvider>
    );
}
