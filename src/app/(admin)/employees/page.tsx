'use client';
import Navbar from "@/components/navbar/navbar";
import ResponsiveNavbar from "@/components/navbar/responsiveNavbar";
import { Button } from '@/components/ui/button';
import EmployeeList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import RadioFilter from "@/components/filter/radioFilter";
import CheckboxFilter from "@/components/filter/checkboxFilter";
import FloatingButton from "@/components/floating/floatingButton";
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const columns = ['Mã nhân viên', 'Tên nhân viên', 'Email', 'Số điện thoại', 'Địa chỉ', 'Ngày vào làm', 'Trạng thái', ''];
    const data = [
        { ma: 'NV001', ten: 'Nguyễn Văn A', email: 'nguyenvana@example.com', sdt: '0912345678', diaChi: 'Hà Nội', ngayVaoLam: '2020-01-15', trangThai: 'Đang làm' },
        { ma: 'NV002', ten: 'Trần Thị B', email: 'tranthib@example.com', sdt: '0922345678', diaChi: 'TP. HCM', ngayVaoLam: '2019-03-12', trangThai: 'Đang làm' },
        { ma: 'NV003', ten: 'Lê Văn C', email: 'levanc@example.com', sdt: '0932345678', diaChi: 'Đà Nẵng', ngayVaoLam: '2021-05-20', trangThai: 'Đang làm' },
        { ma: 'NV004', ten: 'Phạm Thị D', email: 'phamthid@example.com', sdt: '0942345678', diaChi: 'Hải Phòng', ngayVaoLam: '2020-07-10', trangThai: 'Đang làm' },
        { ma: 'NV005', ten: 'Ngô Văn E', email: 'ngovane@example.com', sdt: '0952345678', diaChi: 'Cần Thơ', ngayVaoLam: '2018-11-22', trangThai: 'Đang làm' },
        { ma: 'NV006', ten: 'Đặng Thị F', email: 'dangthif@example.com', sdt: '0962345678', diaChi: 'Nha Trang', ngayVaoLam: '2021-09-03', trangThai: 'Đang làm' },
        { ma: 'NV007', ten: 'Vũ Văn G', email: 'vuvang@example.com', sdt: '0972345678', diaChi: 'Bình Dương', ngayVaoLam: '2022-02-18', trangThai: 'Đang làm' },
        { ma: 'NV008', ten: 'Hoàng Thị H', email: 'hoangthih@example.com', sdt: '0982345678', diaChi: 'Huế', ngayVaoLam: '2019-06-25', trangThai: 'Đang làm' },
        { ma: 'NV009', ten: 'Đinh Văn I', email: 'dinhvani@example.com', sdt: '0992345678', diaChi: 'Quảng Ninh', ngayVaoLam: '2020-08-14', trangThai: 'Đang làm' },
        { ma: 'NV010', ten: 'Phan Thị J', email: 'phanthij@example.com', sdt: '0902345678', diaChi: 'Phú Quốc', ngayVaoLam: '2021-12-01', trangThai: 'Đang làm' }
    ];

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const navigateToCreate = () => {
        router.push('/employees/create');
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
                        <h1 className='font-bold text-[20px] pb-5'><strong>Danh sách nhân viên</strong></h1>
                        <div className="pt-2">
                            <CheckboxFilter
                                title="Vai trò"
                                options={[
                                    { label: 'Nhân viên kho', value: 1 },
                                    { label: 'Nhân viên bán hàng', value: 2 }
                                ]}
                                onChange={handleFilterChange}
                            />
                            <RadioFilter
                                title="Trạng thái"
                                options={[
                                    { label: 'Đang làm', value: 1 },
                                    { label: 'Đã nghỉ', value: 2 }
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
                                <h1 className='font-bold text-[20px] pb-5 px-5'><strong>Danh sách nhân viên</strong></h1>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                selectOptions={[
                                    { value: 'employeeId', label: 'Mã nhân viên' },
                                    { value: 'employeeName', label: 'Tên nhân viên' },
                                    { value: 'phone', label: 'Số điện thoại' }
                                ]}
                            />
                            <Button onClick={navigateToCreate} className='ml-4 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm nhân viên
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
                        <EmployeeList columns={columns} data={data} />
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