'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';

export default function CustomerDetailPageBreadcrumb({
    customerId,
}: {
    customerId: string;
}) {
    const router = useRouter();
    return (
        <Breadcrumb className="my-5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => router.push('/dashboard')}>
                        Trang quản lý
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => router.push('/customers')}>
                        Khách hàng
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{customerId}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
