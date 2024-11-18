'use client';
import IncomeList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

export default function IncomeTable() {
    const columns = [
        { name: 'receiptCode', displayName: 'Mã phiếu' },
        { name: 'orderDto.orderCode', displayName: 'Mã đơn hàng' },
        { name: 'orderDto.customer.fullName', displayName: 'Đối tượng thu' },
        { name: 'totalAmount', displayName: 'Tổng giá trị' },
        { name: 'paidAmount', displayName: 'Đã thanh toán' },
        { name: 'remainAmount', displayName: 'Còn lại' },
        { name: 'dueDate', displayName: 'Hạn thu' },
    ];
    const [dateRange, setDateRange] = useState<[any, any]>(['', '']);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [income, setIncome] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getIncome = async (page?: number, search?: { field?: string, query?: string }, startDate?: any, endDate?: any) => {
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
            const url = `/ReceiptVoucher/all?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            setIncome(data._embedded.receiptVoucherDtoList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu thu:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getIncome(currentPage, currentSearch, startDate, endDate);
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

    const closePopup = (reload?: boolean) => {
        if (reload == true) {
            getIncome(currentPage, currentSearch);
        }
    }

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
                        <SearchBar
                            onSearch={handleSearch}
                            loadingData={loadingData}
                            selectOptions={[
                                { value: 'id', label: 'Mã phiếu' }
                            ]}
                        />
                    </div>
                    <div className='overflow-hidden'>
                        <IncomeList name="Phiếu thu" editUrl="/income/updateIncome" loadingData={loadingData} titles={titles} columns={columns} data={income} tableName="income" handleClose={closePopup} />
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
            <FloatingButton />
        </div>
    );
};

