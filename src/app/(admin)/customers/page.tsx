'use client';
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/navbar/sidebar";
import { Button } from '@/components/ui/button';
import EmployeeList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import RangeFilter from "@/components/filter/rangeFilter";

const Page = () => {
    const router = useRouter();
    const columns = [
        { name: 'employeeCode', displayName: 'Mã khách hàng' },
        { name: 'fullName', displayName: 'Tên khách hàng' },
        { name: 'email', displayName: 'Email' },
        { name: 'phone', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
        { name: 'active', displayName: 'Trạng thái' },
        { name: '', displayName: '' },
    ];
    const [customers, setCustomers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getEmployees = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const token = localStorage.getItem("token");
            const url = `/employees/?${params.toString()}`;
            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            setCustomers(data._embedded.employeeList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
        }
    };

    useEffect(() => {
        getEmployees(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

    const handlePriceChange = (minValue: number, maxValue: number) => {
        setPriceRange({ min: minValue, max: maxValue });
        console.log(priceRange);
    };

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
                <Sidebar />
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
                                <h1 className='font-bold text-[20px] pb-5 px-5'><strong>Danh sách nhân viên</strong></h1>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                selectOptions={[
                                    { value: 'employeeCode', label: 'Mã khách hàng' },
                                    { value: 'fullName', label: 'Tên khách hàng' },
                                    { value: 'phoneNumber', label: 'Số điện thoại' }
                                ]}
                            />
                            <Button onClick={() => router.push("/customers/create")} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm khách hàng
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto lg:ml-7'>
                        <EmployeeList name="Nhân viên" editUrl="/customers/updateCustomer" titles={titles} columns={columns} data={customers} tableName="customers" />
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
            </div>
            <FloatingButton />
        </div>
    );
};

export default Page;
