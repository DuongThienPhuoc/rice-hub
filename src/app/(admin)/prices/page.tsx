'use client';
import Navbar from "@/components/navbar/navbar";
import ResponsiveNavbar from "@/components/navbar/responsiveNavbar";
import { Button } from '@/components/ui/button';
import PriceList from "@/components/list/listPrice";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import RadioFilter from "@/components/filter/radioFilter";
import CheckboxFilter from "@/components/filter/checkboxFilter";
import FloatingButton from "@/components/floating/floatingButton";
// import { useRouter } from 'next/navigation';

const Page = () => {
    // const router = useRouter();
    const columns = ['Mã sản phẩm', 'Tên sản phẩm', 'Giá chung (kg)', ''];
    const data = [
        { ma: 'SP0000001', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000002', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000003', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000004', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000005', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000006', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000007', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000008', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000009', ten: 'ST21', giaTien: '12000' },
        { ma: 'SP0000010', ten: 'ST21', giaTien: '12000' },
    ];

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = () => {

    }

    const [navbarVisible, setNavbarVisible] = useState(false);

    useEffect(() => {
        const updateNavbarVisibility = () => {
            const shouldShowNavbar = window.innerWidth >= 1100;
            setNavbarVisible(shouldShowNavbar);
        };

        updateNavbarVisibility();

        window.addEventListener('resize', updateNavbarVisibility);

        return () => {
            window.removeEventListener('resize', updateNavbarVisibility);
        };
    }, []);
    return (
        <div>
            {navbarVisible ? (
                <Navbar />
            ) : (
                <ResponsiveNavbar />
            )}
            <div className="flex">
                <div style={{ flex: '1' }}></div>
                {navbarVisible && (
                    <div style={{ flex: '2' }} className="my-16">
                        <h1 className='font-bold text-[20px] pb-5'><strong>Bảng giá</strong></h1>
                        <div className="pt-2">
                            <CheckboxFilter
                                title="Loại hàng"
                                options={[
                                    { label: 'Hàng hóa', value: 1 },
                                    { label: 'Dịch vụ', value: 2 },
                                    { label: 'Combo - Đóng gói', value: 3 }
                                ]}
                                onChange={handleFilterChange}
                            />
                            <RadioFilter
                                title="Tồn kho"
                                options={[
                                    { label: 'Tất cả', value: 1 },
                                    { label: 'Dưới định mức tồn', value: 2 },
                                    { label: 'Trên định định tồn', value: 3 },
                                    { label: 'Còn hàng', value: 4 },
                                    { label: 'Hết', value: 5 }
                                ]}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                )}
                <div style={{ flex: '7' }} className='my-16 overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-end items-center lg:items-middle mb-10'>
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {!navbarVisible && (
                                <h1 className='font-bold text-[20px] pb-5 px-5'><strong>Danh sách sản phẩm</strong></h1>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                selectOptions={[
                                    { value: 'productCode', label: 'Mã sản phẩm' },
                                    { value: 'productName', label: 'Tên sản phẩm' },
                                    { value: 'category', label: 'Danh mục' },
                                    { value: 'brand', label: 'Thương hiệu' }
                                ]}
                            />
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto lg:ml-7'>
                        <PriceList columns={columns} data={data} />
                    </div>
                    <Paging
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
                <div style={{ flex: '1' }}></div>
            </div>
            <FloatingButton />
        </div>
    );
};

export default Page;