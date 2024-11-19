/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import React, { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { CalendarClock, DollarSign, Eye, EyeOff } from "lucide-react";
import PopupPay from "@/components/popup/popupPay";
import PopupExtend from "@/components/popup/popupExtend";
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithRange } from '../expenditures/date-range-picker';
import { DateRange } from 'react-day-picker';

export default function IncomeTable() {
    const router = useRouter();
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [isEditVisible, setEditVisible] = useState(false);
    const [isDetailVisible, setDetailVisible] = useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [income, setIncome] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTransaction, setShowTransaction] = useState<any>(null);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });

    const getIncome = async (page?: number, search?: { field?: string, query?: string }, startDate?: any, endDate?: any) => {
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
            console.log(data);
            setIncome(data._embedded.receiptVoucherDtoList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu thu:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const closeDetailPopup = (reload?: boolean) => {
        setDetailVisible(false);
        setSelectedRow(null);
        if (reload === true) {
            getIncome(currentPage, currentSearch, startDate, endDate);
        }
    };

    const closeEditPopup = (reload?: boolean) => {
        setEditVisible(false);
        setSelectedRow(null);
        if (reload === true) {
            getIncome(currentPage, currentSearch, startDate, endDate);
        }
    };

    useEffect(() => {
        getIncome(currentPage, currentSearch, startDate, endDate);
    }, [currentPage, currentSearch, startDate, endDate]);

    useEffect(() => {
        setStartDate(date?.from || null);
        setEndDate(date?.to || null);
    }, [date]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const openDetailPopup = (row: any) => {
        setSelectedRow(row);
        setDetailVisible(true);
    };

    const openEditPopup = (row: any) => {
        setSelectedRow(row);
        setEditVisible(true);
    };

    const formatCurrency = (value: any) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

    const formatDate = (value: any) => {
        const date = new Date(value.toString());
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='p-5 bg-white rounded-lg'>
                        {loadingData ? (
                            <div className='mb-5'>
                                <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                                <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                            </div>
                        ) : (
                            <div className="space-y-2 mb-5">
                                <div className='font-bold text-[1.25rem]'>Phiếu thu</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách phiếu thu
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <div className='flex space-x-2 md:items-center space-y-2 md:space-y-0 md:flex-row flex-col'>
                                <SearchBar
                                    onSearch={handleSearch}
                                    loadingData={loadingData}
                                    selectOptions={[
                                        { value: 'id', label: 'Mã phiếu' }
                                    ]}
                                />
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
                                ) : (
                                    <DatePickerWithRange date={date} setDate={setDate} />
                                )}
                            </div>
                        </div>
                        <div>
                            <div className='w-full'>
                                {loadingData ? (
                                    <div className="w-full">
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                        {Array.from({ length: 10 }).map((_, rowIndex) => (
                                            <div key={rowIndex} className="flex mt-2">
                                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                                        <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                            <TableHead className='bg-[#0090d9]'>
                                                <TableRow>
                                                    <TableCell className='font-semibold text-white'>Mã phiếu</TableCell>
                                                    <TableCell className='font-semibold text-white'>Mã đơn hàng</TableCell>
                                                    <TableCell className='font-semibold text-white'>Ngày tạo phiếu</TableCell>
                                                    <TableCell className='font-semibold text-white'>Đối tượng thu</TableCell>
                                                    <TableCell className='font-semibold text-white'>Tổng giá trị</TableCell>
                                                    <TableCell className='font-semibold text-white'>Đã thanh toán</TableCell>
                                                    <TableCell className='font-semibold text-white'>Còn lại</TableCell>
                                                    <TableCell className='font-semibold text-white'>Hạn thu</TableCell>
                                                    <TableCell align='center' className='font-semibold text-white'>Hành động</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {income && income.length !== 0 ? (
                                                    income.map((row: any, rowIndex) => (
                                                        <>
                                                            <TableRow key={rowIndex} className={`font-semibold bg-white`}>
                                                                <TableCell>{row.receiptCode}</TableCell>
                                                                <TableCell onClick={() => router.push(`/admin/orders/${row.orderDto.id}`)} className="text-blue-500 cursor-pointer hover:text-blue-300 font-semibold">
                                                                    {row.orderDto.orderCode}
                                                                </TableCell>
                                                                <TableCell>{formatDate(row.receiptDate)}</TableCell>
                                                                <TableCell>{row.orderDto.customer.fullName}</TableCell>
                                                                <TableCell>{formatCurrency(row.totalAmount)}</TableCell>
                                                                <TableCell>{formatCurrency(row.paidAmount)}</TableCell>
                                                                <TableCell>{formatCurrency(row.remainAmount)}</TableCell>
                                                                <TableCell>{formatDate(row.dueDate)}</TableCell>
                                                                <TableCell className="text-center px-4 py-3">
                                                                    <div className="flex justify-center items-center space-x-3">
                                                                        <div className="relative group">
                                                                            {showTransaction === rowIndex ? (
                                                                                <button hidden={row.remainAmount === 0} onClick={() => setShowTransaction(null)}>
                                                                                    <EyeOff size={18} />
                                                                                </button>
                                                                            ) : (
                                                                                <button hidden={row.remainAmount === 0} onClick={() => setShowTransaction(rowIndex)}>
                                                                                    <Eye size={18} />
                                                                                </button>
                                                                            )}
                                                                            <span className="absolute w-[100px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Lịch sử giao dịch
                                                                            </span>
                                                                        </div>
                                                                        <div className="relative group">
                                                                            <button hidden={row?.remainAmount === 0} onClick={() => openDetailPopup(row)}>
                                                                                <DollarSign size={18} />
                                                                            </button>
                                                                            <span className="absolute w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Thanh toán
                                                                            </span>
                                                                        </div>
                                                                        <div className="relative group">
                                                                            <button hidden={row.remainAmount === 0} onClick={() => openEditPopup(row)}>
                                                                                <CalendarClock size={18} />
                                                                            </button>
                                                                            <span className="absolute w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Gia hạn
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            {showTransaction === rowIndex && row.transactionDtoList && (
                                                                row.transactionDtoList.length > 0 ? (
                                                                    <TableRow>
                                                                        <TableCell colSpan={9} align='center' className='p-0'>
                                                                            <div className="w-full">
                                                                                <Table aria-label="simple table">
                                                                                    <TableHead className="bg-green-500 ">
                                                                                        <TableRow>
                                                                                            <TableCell align='center' className="text-white">STT</TableCell>
                                                                                            <TableCell align='center' className="text-white">Phương thức thanh toán</TableCell>
                                                                                            <TableCell align='center' className="text-white">Ngày giao dịch</TableCell>
                                                                                            <TableCell align='center' className="text-white">Giá trị</TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {row.transactionDtoList.map((transaction: any, index: any) => (
                                                                                            <TableRow key={index}>
                                                                                                <TableCell align='center'>{index + 1}</TableCell>
                                                                                                <TableCell align='center'>{transaction.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Tiền mặt'}</TableCell>
                                                                                                <TableCell align='center'>{formatDate(transaction.transactionDate)}</TableCell>
                                                                                                <TableCell align='center'>{formatCurrency(transaction.amount)}</TableCell>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={9} align='center' className='p-0'>
                                                                            <div className="w-full">
                                                                                <Table aria-label="simple table">
                                                                                    <TableHead className="bg-green-500 text-white">
                                                                                        <TableRow>
                                                                                            <TableCell align='center' className="text-white">STT</TableCell>
                                                                                            <TableCell align='center' className="text-white">Phương thức thanh toán</TableCell>
                                                                                            <TableCell align='center' className="text-white">Ngày giao dịch</TableCell>
                                                                                            <TableCell align='center' className="text-white">Giá trị</TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={6}>
                                                                                                <div className="flex w-full h-[160px] justify-center items-center">
                                                                                                    Chưa có giao dịch
                                                                                                </div>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                        </>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={9}>
                                                            <div className="my-10 mx-4 text-center text-gray-500">
                                                                Không có dữ liệu
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                                {isDetailVisible && selectedRow != null && (
                                    <PopupPay data={selectedRow} handleClose={closeDetailPopup} />
                                )}
                                {isEditVisible && selectedRow != null && (
                                    <PopupExtend data={selectedRow} handleClose={closeEditPopup} />
                                )}
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <Paging
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </section>
            <FloatingButton />
        </div>
    );
};

