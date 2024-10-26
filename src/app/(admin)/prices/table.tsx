'use client';

import { Button } from '@/components/ui/button';
import PriceList from "@/components/list/listPrice";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import DropdownSearchBar from "@/components/searchbar/dropdownSearchBar";
// import { useRouter } from 'next/navigation';

export default function PriceTable() {
    // const router = useRouter();
    const columns = ['Mã sản phẩm', 'Tên sản phẩm', 'Giá nhập', 'Đơn giá (kg)'];
    const data = [
        { ma: 'SP0000001', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000002', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000003', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000004', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000005', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000006', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000007', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000008', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000009', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
        { ma: 'SP0000010', ten: 'ST21', importPrice: '10000', giaTien: '12000' },
    ];

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePriceChange = (value: string) => {
        console.log(value);
    }

    return (
        <div>
            <div className="flex">
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'productCode', label: 'Mã sản phẩm' },
                                { value: 'productName', label: 'Tên sản phẩm' },
                                { value: 'category', label: 'Danh mục' },
                                { value: 'brand', label: 'Thương hiệu' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <DropdownSearchBar
                                onChange={handlePriceChange}
                                selectOptions={[
                                    { value: 'basic', label: 'Bảng giá chung' },
                                    { value: 'customer A', label: 'Bảng giá A' },
                                    { value: 'customer B', label: 'Bảng giá B' },
                                    { value: 'customer C', label: 'Bảng giá C' }
                                ]}
                            />
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <PriceList columns={columns} data={data} />
                    </div>
                    <Paging
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <FloatingButton />
        </div>
    );
};

