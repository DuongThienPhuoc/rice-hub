import { SidebarTrigger } from '@/components/ui/sidebar';
import CustomerTable from './table';
import { Separator } from '@/components/ui/separator';
import CustomerPageBreadcrumb from './breadcrumb';

export default function CustomerPage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CustomerPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <CustomerTable />
            </section>
        </>
    );
}
