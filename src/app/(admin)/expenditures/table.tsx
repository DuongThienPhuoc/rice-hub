/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import ExpenseList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import PopupExpense from '@/components/popup/popupExpenditure';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

export default function EmployeeTable() {
    const columns = [
        { name: 'expenseCode', displayName: 'Mã phiếu' },
        { name: 'type', displayName: 'Loại chi' },
        { name: 'expenseDate', displayName: 'Ngày chi' },
        { name: 'totalAmount', displayName: 'Tổng giá trị' },
        { name: 'note', displayName: 'Mô tả' },
    ];
    const [isPopupVisible, setPopupVisible] = useState(false);

    const closePopup = (reload?: boolean) => {
        setPopupVisible(false);
        if (reload == true) {
            setCurrentPage(1);
            setCurrentSearch({ field: '', query: '' });
        }
    }

    const closeEdit = (reload?: boolean) => {
        if (reload == true) {
            setCurrentPage(1);
            setCurrentSearch({ field: '', query: '' });
        }
    }

    const openPopup = () => setPopupVisible(true);
    const [dateRange, setDateRange] = useState<[any, any]>(['', '']);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [expense, setExpense] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });

    const titles = [
        { name: 'id', displayName: 'Số phiếu', type: 'hidden' },
        { name: 'expenseCode', displayName: 'Mã phiếu', type: 'readOnly' },
        { name: 'type', displayName: 'Loại chi', type: 'text' },
        { name: 'expenseDate', displayName: 'Ngày chi', type: 'readOnly' },
        { name: 'totalAmount', displayName: 'Tổng giá trị', type: 'number' },
        { name: 'note', displayName: 'Mô tả', type: 'textArea' },

    ];

    const getExpense = async (page?: number, search?: { field?: string, query?: string }, startDate?: any, endDate?: any) => {
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
            if (startDate && endDate) {
                params.append("startDate", new Date(new Date(startDate).setDate(new Date(startDate).getDate())).toISOString());
                params.append("endDate", new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString());
            }
            const url = `/ExpenseVoucher/all?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            setExpense(data._embedded.expenseVoucherDtoList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu chi:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getExpense(currentPage, currentSearch, startDate, endDate);
    }, [currentPage, currentSearch, startDate, endDate]);

    useEffect(() => {
        setStartDate(dateRange[0]);
        setEndDate(dateRange[1]);
    }, [dateRange])

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <div className="border border-[#ccc] rounded-[4px] p-[5px]" style={{ boxShadow: '0px 4px 8px lightgray' }}>
                            <Flatpickr
                                className='border-none outline-none p-[5px]'
                                value={dateRange}
                                onChange={([startDate, endDate]) => {
                                    setDateRange([startDate, endDate])
                                }}
                                options={{
                                    mode: "range",
                                    dateFormat: "d/m/Y",
                                    locale: {
                                        rangeSeparator: " ~ ",
                                    },
                                }}
                                placeholder="_/__/___ ~ _/__/___"
                            />
                            <span className="icon">&#x1F4C5;</span>
                        </div>
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'id', label: 'Mã phiếu' }
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0 ml-0 lg:ml-4'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button onClick={openPopup} className='mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                        Thêm phiếu chi
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <ExpenseList name="Phiếu chi" editUrl="/ExpenseVoucher/update" loadingData={loadingData} titles={titles} columns={columns} data={expense} tableName="ExpenseVoucher" handleClose={closeEdit} />
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
            {isPopupVisible && <PopupExpense handleClose={closePopup} />}
            <FloatingButton />
        </div>
    );
};

