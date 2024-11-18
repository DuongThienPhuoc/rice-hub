import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import ProductionPageBreadcrumb from './breadcrumb';
import ProductionTable from './table';

export default function ProductionPage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <ProductionPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <ProductionTable />
            </section>
        </>
    );
}
