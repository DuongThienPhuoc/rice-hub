import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import EmployeePageBreadcrumb from './breadcrumb';
import EmployeeTable from './table';

export default function EmployeePage() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <EmployeePageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <EmployeeTable />
            </section>
        </>
    );
}
