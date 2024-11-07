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

export default function AdminOrdersPageBreadcrumb() {
    const router = useRouter();
    return (
        <Breadcrumb className="my-5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => router.push('/')}>
                        Trang chủ
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Đơn hàng</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
