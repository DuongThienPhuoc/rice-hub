import { ReactNode } from 'react';
import { Metadata } from 'next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import CategoryPageBreadcrumb from './breadcrumb';

export const metadata: Metadata = {
    title: 'Danh mục',
    description: 'Danh mục',
};

export default function CategoryLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CategoryPageBreadcrumb />
            </header>
            {children}
        </>
    );
}
