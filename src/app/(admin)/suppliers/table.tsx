'use client';
import { Button } from '@/components/ui/button';
import SupplierList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import PopupCreate from "@/components/popup/popupCreate";
import { PlusIcon } from 'lucide-react';

export default function SupplierTable() {
    const columns = [
        { name: 'id', displayName: 'Mã' },
        { name: 'name', displayName: 'Tên' },
        { name: 'contactPerson', displayName: 'Người liên hệ' },
        { name: 'email', displayName: 'Email' },
        { name: 'phoneNumber', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: 'id', displayName: 'Mã', type: 'hidden' },
        { name: 'name', displayName: 'Tên', type: 'text' },
        { name: 'contactPerson', displayName: 'Người liên hệ', type: 'text' },
        { name: 'email', displayName: 'Email', type: 'text' },
        { name: 'phoneNumber', displayName: 'Số điện thoại', type: 'text' },
        { name: 'address', displayName: 'Địa chỉ', type: 'text' },
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
            const url = `/suppliers/?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            setSuppliers(data._embedded.supplierList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
        } finally {
            setLoadingData(false);
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

    return (
        <div>
            <section className='col-span-4'>
                <div className='overflow-x-auto w-full'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'name', label: 'Nhà cung cấp' },
                                { value: 'email', label: 'Email' },
                                { value: 'phoneNumber', label: 'Số điện thoại' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <Button onClick={openPopup} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm nhà cung cấp
                                <PlusIcon />
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <SupplierList name="Nhà cung cấp" editUrl="/suppliers/updateSupplier" titles={titles} loadingData={loadingData} columns={columns} data={suppliers} tableName="suppliers" handleClose={closeEdit} />
                    </div>
                    {totalPages > 1 && (
                        <Paging
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </section>
            {isPopupVisible && <PopupCreate tableName="Nhà cung cấp" url="/suppliers/createSupplier" titles={titles} handleClose={closeCreate} />}
            <FloatingButton />
        </div>
    );
};

