import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import ExportPageBreadcrumb from './breadcrumb';
import ExportTable from './table';

export default function ExportPage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <ExportPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <ExportTable />
            </section>
        </>
    );
}
