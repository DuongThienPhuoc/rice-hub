'use client';

import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithRange } from '@/app/(admin)/expenditures/date-range-picker';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableCell,
    TableRow,
    TableBody,
    TableHead,
    TableHeader, TableFooter
} from '@/components/ui/table';
import { ExpenseVoucher } from '@/type/expenditures';
import { getExpenditures } from '@/data/expenditures';
import { currencyHandleProvider } from '@/utils/currency-handle';
import AddPaymentVoucherDialogProvider from '@/app/(admin)/expenditures/dialog';
import PaginationComponent from '@/components/pagination/pagination';
import { DateRange } from 'react-day-picker';
import { Ellipsis } from 'lucide-react';
import ActionDropdownProvider from '@/app/(admin)/payroll/action-dropdown';

export default function EmployeeTable() {
    const [expenditures, setExpenditures] = React.useState<ExpenseVoucher[]>(
        [],
    );
    const [totalPage, setTotalPage] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [reFresh, setReFresh] = React.useState(false);

    useEffect(() => {
        const endDateUTC = new Date(date?.to || new Date());
        const endDateNumber = new Date(endDateUTC).setDate(endDateUTC.getDate() + 1);
        const endDate = new Date(endDateNumber).toISOString();
        getExpenditures({
            startDate: date?.from?.toISOString(),
            endDate: date?.to ? endDate : undefined,
            pageNumber: currentPage + 1,
        })
            .then((data) => {
                setExpenditures(data._embedded?.expenseVoucherDtoList || []);
                setTotalPage(data.page.totalPages);
            })
            .catch((e) => console.error(e));
    }, [reFresh, currentPage, date]);

    return (
        <div className="bg-white p-4 space-y-4 rounded border">
            <div className="space-y-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Phiếu chi
                </h3>
                <p className="text-sm text-muted-foreground">
                    Quản lý danh sách phiếu chi
                </p>
            </div>
            <Separator orientation="horizontal" />
            <div className="flex justify-between">
                <DatePickerWithRange date={date} setDate={setDate} />
                <AddPaymentVoucherDialogProvider
                    refresh={reFresh}
                    setRefresh={setReFresh}
                >
                    <Button
                        className="flex items-center gap-2"
                        variant="outline"
                    >
                        <CirclePlus className="w-4 h-4" />
                        <span>Thêm phiếu chi</span>
                    </Button>
                </AddPaymentVoucherDialogProvider>
            </div>
            <div className="rounded border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã phiếu chi</TableHead>
                            <TableHead>Ngày xuất</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="text-center">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenditures.length > 0 && (
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
                                        <TableCell align="center">
                                            <ActionDropdownProvider expenseVoucher={expenditure}>
                                                <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                                    <Ellipsis className="w-4 h-4" />
                                                </div>
                                            </ActionDropdownProvider>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="bg-white hover:bg-none"
                            >
                                <PaginationComponent
                                    totalPages={totalPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}
