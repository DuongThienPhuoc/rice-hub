import React from 'react';
import AppSidebar from '@/components/app-sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-white">{children}</main>
        </SidebarProvider>
    );
}
