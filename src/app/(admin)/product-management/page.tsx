'use client';
import React, { useState } from 'react';
import Navbar from "@/components/navbar/navbar";
import { Button } from '@/components/ui/button';
import ProductList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';

const Page = () => {
    const columns = ['Mã sản phẩm', 'Tên sản phẩm', 'Số lượng (kg)', 'Giá tiền (kg)', 'Ngày nhập kho', 'Lô hàng', 'Nhà cung cấp', ''];
    const data = [
        { ma: '0000000000000000001', ten: 'ST21', soLuong: '50', giaTien: '12000', ngayNhapKho: '18/09/2024', loHang: 'HE170268', nhaCungCap: 'N/A' },
        { ma: '0000000000000000002', ten: 'ST25', soLuong: '100', giaTien: '20000', ngayNhapKho: '18/09/2024', loHang: 'HE170268', nhaCungCap: 'N/A' },
    ];

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <div>
            <Navbar />
            <div className='mx-44 my-16'>
                <div className='flex justify-between items-middle mb-10'>
                    <h1 className='font-bold text-[25px]'><strong>Danh sách sản phẩm</strong></h1>
                    <div className='flex items-center'>
                        <SearchBar onSearch={handleSearch} />
                        <Button className='ml-5 px-6 py-6 text-[17px] hover:bg-[#1d1d1fca]'>Thêm sản phẩm</Button>
                    </div>
                </div>
                <ProductList columns={columns} data={data} />
                <Paging currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default Page;