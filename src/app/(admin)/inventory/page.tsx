import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import InventoryPageBreadcrumb from './breadcrumb';
import InventoryTable from './table';

export default function InventoryPage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <InventoryPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <InventoryTable />
            </section>
        </>
    );
}
