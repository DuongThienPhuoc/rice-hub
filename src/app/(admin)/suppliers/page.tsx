'use client';
import Navbar from "@/components/navbar/navbar";
import ResponsiveNavbar from "@/components/navbar/responsiveNavbar";
import { Button } from '@/components/ui/button';
import SupplierList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const columns = ['Mã nhà cung cấp', 'Tên nhà cung cấp', 'Email', 'Số điện thoại', 'Người liên hệ', 'Địa chỉ', ''];
    const data = [
        { ma: '1', ten: 'Nhà cung cấp 1', email: 'demo1@gmail.com', sdt: '0912345678', contact: 'Chị Hằng', diaChi: 'Hà Nội' },
        { ma: '2', ten: 'Nhà cung cấp 2', email: 'demo2@gmail.com', sdt: '0912345678', contact: 'Anh Tiến', diaChi: 'Hà Nội' },
        { ma: '3', ten: 'Nhà cung cấp 3', email: 'demo3@gmail.com', sdt: '0912345678', contact: 'Anh Bằng', diaChi: 'Hà Nội' },
        { ma: '4', ten: 'Nhà cung cấp 4', email: 'demo4@gmail.com', sdt: '0912345678', contact: 'Chị Ngọc', diaChi: 'Hà Nội' },
        { ma: '5', ten: 'Nhà cung cấp 5', email: 'demo5@gmail.com', sdt: '0912345678', contact: 'Anh Cường', diaChi: 'Hà Nội' },
        { ma: '6', ten: 'Nhà cung cấp 6', email: 'demo6@gmail.com', sdt: '0912345678', contact: 'Anh Hiếu', diaChi: 'Hà Nội' },
        { ma: '7', ten: 'Nhà cung cấp 7', email: 'demo7@gmail.com', sdt: '0912345678', contact: 'Chị Linh', diaChi: 'Hà Nội' },
        { ma: '8', ten: 'Nhà cung cấp 8', email: 'demo8@gmail.com', sdt: '0912345678', contact: 'Em Thúy', diaChi: 'Hà Nội' },
        { ma: '9', ten: 'Nhà cung cấp 9', email: 'demo9@gmail.com', sdt: '0912345678', contact: 'Anh Hải', diaChi: 'Hà Nội' },
        { ma: '10', ten: 'Nhà cung cấp 10', email: 'demo10@gmail.com', sdt: '0912345678', contact: 'Cô Liên', diaChi: 'Hà Nội' },

    ];

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const navigateToCreate = () => {
        router.push('/suppliers/create');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                <div style={{ flex: '9' }} className='my-16 overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle mb-10'>
                        {navbarVisible && (
                            <h1 className='font-bold text-[20px] pb-5'><strong>Danh sách nhà cung cấp</strong></h1>
                        )}
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {!navbarVisible && (
                                <h1 className='font-bold text-[20px] pb-5 px-5'><strong>Danh sách nhà cung cấp</strong></h1>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                selectOptions={[
                                    { value: 'name', label: 'Nhà cung cấp' },
                                    { value: 'email', label: 'Email' },
                                    { value: 'phone', label: 'Số điện thoại' }
                                ]}
                            />
                            <Button onClick={navigateToCreate} className='ml-4 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm nhà cung cấp
                            </Button>
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <SupplierList columns={columns} data={data} tableName="suppliers" />
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