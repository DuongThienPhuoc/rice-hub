'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function DashboardPageBreadcrumb() {
    return (
        <Breadcrumb className="my-5">
            <BreadcrumbList>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbPage className='text-white'>
                        Trang quản lý
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
