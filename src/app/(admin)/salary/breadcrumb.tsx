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

export default function SalaryPageBreadcrumb() {
    const router = useRouter();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className='text-white hover:font-bold hover:text-white' onClick={() => router.push('/dashboard')}>
                        Trang quản lý
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbPage className='text-white'>Chấm công</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
