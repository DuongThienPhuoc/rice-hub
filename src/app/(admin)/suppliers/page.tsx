'use client';
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/navbar/sidebar";
import { Button } from '@/components/ui/button';
import SupplierList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import PopupCreate from "@/components/popup/popupCreate";

const Page = () => {
    const columns = [
        { name: 'id', displayName: 'Mã nhà cung cấp' },
        { name: 'name', displayName: 'Tên nhà cung cấp' },
        { name: 'contactPerson', displayName: 'Người liên hệ' },
        { name: 'email', displayName: 'Email' },
        { name: 'phoneNumber', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
        { name: 'active', displayName: 'Trạng thái' },
        { name: '', displayName: '' },
    ];
    const [suppliers, setSuppliers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: 'id', displayName: 'Mã nhà cung cấp', type: 'hidden' },
        { name: 'name', displayName: 'Tên nhà cung cấp', type: 'text' },
        { name: 'contactPerson', displayName: 'Người liên hệ', type: 'text' },
        { name: 'email', displayName: 'Email', type: 'text' },
        { name: 'phoneNumber', displayName: 'Số điện thoại', type: 'number' },
        { name: 'address', displayName: 'Địa chỉ', type: 'text' },
        { name: 'active', displayName: 'Trạng thái', type: 'checkbox' },
    ];

    const openPopup = () => setPopupVisible(true);
    const closeCreate = (reload?: boolean) => {
        setPopupVisible(false);
        if (reload == true) {
            setCurrentPage(1);
            setCurrentSearch({ field: '', query: '' });
        }
    }

    const closeEdit = (reload?: boolean) => {
        if (reload == true) {
            getSuppliers(currentPage, currentSearch);
        }
    }

    const getSuppliers = async (page?: number, search?: { field?: string, query?: string }) => {
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
            const url = `/suppliers/?${params.toString()}`;
            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            setSuppliers(data._embedded.supplierList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
        }
    };

    useEffect(() => {
        getSuppliers(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                                    { value: 'phoneNumber', label: 'Số điện thoại' }
                                ]}
                            />
                            <Button onClick={openPopup} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm nhà cung cấp
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <SupplierList name="Nhà cung cấp" editUrl="/suppliers/updateSupplier" titles={titles} columns={columns} data={suppliers} tableName="suppliers" handleClose={closeEdit} />
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
            {isPopupVisible && <PopupCreate tableName="Nhà cung cấp" url="/suppliers/createSupplier" titles={titles} handleClose={closeCreate} />}
            <FloatingButton />
        </div>
    );
};

export default Page;