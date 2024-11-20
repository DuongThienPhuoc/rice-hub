import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import PricePageBreadcrumb from './breadcrumb';
import PriceTable from './table';

export default function ImportPage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <PricePageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <PriceTable />
            </section>
        </>
    );
}
