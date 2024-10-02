'use client';
import Navbar from "@/components/navbar/navbar";
import ResponsiveNavbar from "@/components/navbar/responsiveNavbar";
import { Button } from '@/components/ui/button';
import CustomerList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import { useRouter } from 'next/navigation';
import RangeFilter from "@/components/filter/rangeFilter";

const Page = () => {
    const router = useRouter();
    const columns = ['Mã khách hàng', 'Tên khách hàng', 'Email', 'Số điện thoại', 'Địa chỉ', 'Nợ hiện tại', 'Tổng bán', ''];
    const data = [
        { ma: 'NV001', ten: 'Nguyễn Văn A', email: 'nguyenvana@example.com', sdt: '0912345678', diaChi: 'Hà Nội', noHientai: '20000000', tongBan: '100000000' },
        { ma: 'NV002', ten: 'Trần Thị B', email: 'tranthib@example.com', sdt: '0922345678', diaChi: 'TP. HCM', noHientai: '14000000', tongBan: '100000000' },
        { ma: 'NV003', ten: 'Lê Văn C', email: 'levanc@example.com', sdt: '0932345678', diaChi: 'Đà Nẵng', noHientai: '20000000', tongBan: '100000000' },
        { ma: 'NV004', ten: 'Phạm Thị D', email: 'phamthid@example.com', sdt: '0942345678', diaChi: 'Hải Phòng', noHientai: '0', tongBan: '100000000' },
        { ma: 'NV005', ten: 'Ngô Văn E', email: 'ngovane@example.com', sdt: '0952345678', diaChi: 'Cần Thơ', noHientai: '0', tongBan: '100000000' },
        { ma: 'NV006', ten: 'Đặng Thị F', email: 'dangthif@example.com', sdt: '0962345678', diaChi: 'Nha Trang', noHientai: '0', tongBan: '100000000' },
        { ma: 'NV007', ten: 'Vũ Văn G', email: 'vuvang@example.com', sdt: '0972345678', diaChi: 'Bình Dương', noHientai: '0', tongBan: '100000000' },
        { ma: 'NV008', ten: 'Hoàng Thị H', email: 'hoangthih@example.com', sdt: '0982345678', diaChi: 'Huế', noHientai: '0', tongBan: '100000000' },
        { ma: 'NV009', ten: 'Đinh Văn I', email: 'dinhvani@example.com', sdt: '0992345678', diaChi: 'Quảng Ninh', noHientai: '0', tongBan: '100000000' },
        { ma: 'NV010', ten: 'Phan Thị J', email: 'phanthij@example.com', sdt: '0902345678', diaChi: 'Phú Quốc', noHientai: '0', tongBan: '100000000' }
    ];

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const navigateToCreate = () => {
        router.push('/customers/create');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

    const handlePriceChange = (minValue: number, maxValue: number) => {
        setPriceRange({ min: minValue, max: maxValue });
        console.log(priceRange);
    };

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
                        <h1 className='font-bold text-[20px] pb-5'><strong>Danh sách khách hàng</strong></h1>
                        <div className="pt-2">
                            <RangeFilter
                                title="Tổng bán"
                                min={0}
                                max={1000000000}
                                step={1000000}
                                onChange={handlePriceChange}
                            />
                            <RangeFilter
                                title="Tổng nợ"
                                min={0}
                                max={100000000}
                                step={1000000}
                                onChange={handlePriceChange}
                            />
                        </div>
                    </div>
                )}
                <div style={{ flex: '7' }} className='my-16 overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-end items-center lg:items-middle mb-10'>
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {!navbarVisible && (
                                <h1 className='font-bold text-[20px] pb-5 px-5'><strong>Danh sách khách hàng</strong></h1>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                selectOptions={[
                                    { value: 'customerId', label: 'Mã khách hàng' },
                                    { value: 'customerName', label: 'Tên khách hàng' },
                                    { value: 'phone', label: 'Số điện thoại' }
                                ]}
                            />
                            <Button onClick={navigateToCreate} className='ml-4 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm khách hàng
                            </Button>
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto lg:ml-7'>
                        <CustomerList columns={columns} data={data} tableName="customers" />
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