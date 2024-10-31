/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import ProductList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { PlusIcon } from 'lucide-react';

export default function ProductTable() {
    const columns = [
        { name: 'productCode', displayName: 'Mã sản phẩm' },
        { name: 'productName', displayName: 'Tên sản phẩm' },
        { name: 'price', displayName: 'Giá nhập (kg)' },
        { name: 'productQuantity', displayName: 'Tồn kho (kg)' },
        { name: 'importDate', displayName: 'Ngày nhập' },
        { name: 'supplierName', displayName: 'Nhà cung cấp' },
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getProducts = async (page?: number, search?: { field?: string, query?: string }) => {
        setLoadingData(true);
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/products/admin/products?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            if (data._embedded) {
                setProducts(data._embedded.adminProductDtoList);
                setTotalPages(data.page.totalPages);
            } else {
                alert("Danh sách rỗng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getProducts(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'productCode', label: 'Mã sản phẩm' },
                                { value: 'productName', label: 'Tên sản phẩm' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm sản phẩm
                                <PlusIcon />
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <ProductList name="Sản phẩm" editUrl="/products/update/1" titles={titles} loadingData={loadingData} columns={columns} data={products} tableName="products" />
                    </div>
                    {totalPages > 1 && (
                        <Paging
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
                <div style={{ flex: '1' }}></div>
            </section>
            <FloatingButton />
        </div>
    );
};
