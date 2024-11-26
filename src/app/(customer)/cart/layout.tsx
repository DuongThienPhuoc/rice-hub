import { ReactNode } from 'react';
import { Metadata } from 'next';
import { SidebarTriggerCommon } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import CartPageBreadcrumb from '@/app/(customer)/cart/breadcrumb';

export const metadata: Metadata = {
    title: 'Giỏ hàng',
    description: 'Giỏ hàng',
};

export default function CartLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTriggerCommon />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CartPageBreadcrumb />
            </header>
           {children}
        </>
    );
}
