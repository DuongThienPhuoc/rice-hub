/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithRange } from '@/app/(admin)/expenditures/date-range-picker';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpenseVoucher } from '@/type/expenditures';
import { getExpenditures } from '@/data/expenditures';
import { currencyHandleProvider } from '@/utils/currency-handle';
import AddPaymentVoucherDialogProvider from '@/app/(admin)/expenditures/dialog';
import { DateRange } from 'react-day-picker';
import { Ellipsis } from 'lucide-react';
import ActionDropdownProvider from '@/app/(admin)/payroll/action-dropdown';
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';

export default function EmployeeTable() {
    const [expenditures, setExpenditures] = React.useState<ExpenseVoucher[]>(
        [],
    );
    const [loadingData, setLoadingData] = useState(true);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [reFresh, setReFresh] = React.useState(false);

    const handleSearch = () => {

    };

    useEffect(() => {
        const endDateUTC = new Date(date?.to || new Date());
        const endDateNumber = new Date(endDateUTC).setDate(endDateUTC.getDate() + 1);
        const endDate = new Date(endDateNumber).toISOString();
        getExpenditures({
            startDate: date?.from?.toISOString(),
            endDate: date?.to ? endDate : undefined,
            pageNumber: currentPage,
        })
            .then((data) => {
                setLoadingData(false);
                setExpenditures(data._embedded?.expenseVoucherDtoList || []);
                setTotalPage(data.page.totalPages);
            })
            .catch((e) => console.error(e));
    }, [reFresh, currentPage, date]);

    return (
        <div className="bg-white mx-5 p-5 rounded">
            {loadingData ? (
                <div className='mb-5'>
                    <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                    <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                </div>
            ) : (
                <div className="space-y-2 mb-5">
                    <div className='font-bold text-[1.25rem]'>Phiếu chi</div>
                    <p className="text-sm text-muted-foreground">
                        Quản lý danh sách phiếu chi
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
                {loadingData ? (
                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                ) : (
                    <AddPaymentVoucherDialogProvider
                        refresh={reFresh}
                        setRefresh={setReFresh}
                    >
                        <Button className='ml-0 mt-2 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                            <span>Thêm phiếu chi</span>
                            <Plus />
                        </Button>
                    </AddPaymentVoucherDialogProvider>
                )}
            </div>
            <div className='overflow-hidden'>
                <div className='w-full overflow-x-auto'>
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
                                        <TableCell><p className='font-semibold text-white'>Mã phiếu chi</p></TableCell>
                                        <TableCell><p className='font-semibold text-white'>Ngày xuất</p></TableCell>
                                        <TableCell><p className='font-semibold text-white'>Tổng tiền</p></TableCell>
                                        <TableCell><p className='font-semibold text-white'>Loại</p></TableCell>
                                        <TableCell><p className='font-semibold text-white'>Mô tả</p></TableCell>
                                        <TableCell align='center'>
                                            <p className='font-semibold text-white'>
                                                Hành động
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {expenditures.length > 0 ? (
                                        <>
                                            {expenditures.map((expenditure) => (
                                                <TableRow key={expenditure.id}>
                                                    <TableCell>
                                                        {expenditure.expenseCode}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            expenditure.expenseDate,
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {currencyHandleProvider(
                                                            expenditure.totalAmount,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {expenditure.type}
                                                    </TableCell>
                                                    <TableCell>
                                                        {expenditure?.note || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex justify-center'>
                                                            <ActionDropdownProvider expenseVoucher={expenditure}>
                                                                <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                                                    <Ellipsis className="w-4 h-4" />
                                                                </div>
                                                            </ActionDropdownProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5}>
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
                </div>
            </div>
            {totalPage > 1 && (
                <Paging
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
