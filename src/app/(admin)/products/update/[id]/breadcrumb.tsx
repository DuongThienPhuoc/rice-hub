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

export default function UpdateProductPageBreadcrumb({
    productId,
}: {
    productId: string;
}) {
    const router = useRouter();
    return (
        <Breadcrumb className="my-5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className='text-white hover:font-bold hover:text-white' onClick={() => router.push('/dashboard')}>
                        Trang quản lý
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbLink className='text-white hover:font-bold hover:text-white' onClick={() => router.push('/products')}>
                        Sản phẩm
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbLink className='text-white hover:font-bold hover:text-white' onClick={() => router.push(`/products/${productId}`)}>
                        {productId}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-white' />
                <BreadcrumbItem>
                    <BreadcrumbPage className='text-white'>Chỉnh sửa</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
