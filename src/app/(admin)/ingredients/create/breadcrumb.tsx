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

export default function CreateProductPageBreadcrumb() {
    const router = useRouter();
    return (
        <Breadcrumb className="my-5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className='text-white hover:text-white hover:font-bold' onClick={() => router.push('/dashboard')}>
                        Trang quản lý
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbLink className='text-white hover:text-white hover:font-bold' onClick={() => router.push('/ingredients')}>
                        Nguyên liệu
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbPage className='text-white'>Thêm nguyên liệu</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
