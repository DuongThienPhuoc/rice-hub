import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import ProductPageBreadcrumb from './breadcrumb';
import ProductTable from './table';

export default function ProductPage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-gradient-to-r from-[#0090d9] to-[#b3d9ff] lg:from-[#0090d9] lg:via-[#ffffff] lg:to-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <ProductPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <ProductTable />
            </section>
        </>
    );
}
