/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import ReceiptList from "@/components/list/list";
import Paging from '@/components/paging/paging';
import React, { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import SearchBar from '@/components/searchbar/searchbar';
import { DatePickerWithRange } from '../expenditures/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Separator } from '@/components/ui/separator';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useToast } from '@/hooks/use-toast';

export default function ProductionTable() {
    const router = useRouter();
    const columns = [
        { name: 'productionCode', displayName: 'Mã phiếu' },
        { name: 'productName', displayName: 'Nguyên liệu' },
        { name: 'productionDate', displayName: 'Ngày tạo phiếu' },
        { name: 'creator.fullName', displayName: 'Người tạo' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
    const { toast } = useToast();
    const [onPageChange, setOnPageChange] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const titles = [
        { name: '', displayName: '', type: '' },
    ];
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const getData = async (page?: number, startDate?: any, endDate?: any) => {
        try {
            const params = new URLSearchParams();
            params.append("size", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (startDate && endDate) {
                params.append("startDate", new Date(new Date(startDate).setDate(new Date(startDate).getDate())).toISOString());
                params.append("endDate", new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString());
            }
            const url = `/productionOrder/getWithFilter?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data?.totalElements > 0) {
                setReceipts(data.content);
                setTotalPages(data.totalPages);
            } else {
                setReceipts([]);
                toast({
                    variant: 'destructive',
                    title: 'Không tìm thấy phiếu sản xuất!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000,
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách phiếu sản xuất!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getData(currentPage, startDate, endDate);
    }, [currentPage, startDate, endDate]);

    useEffect(() => {
        setStartDate(date?.from || null);
        setEndDate(date?.to || null);
    }, [date]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

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
                                <div className='font-bold text-[1.25rem]'>Phiếu sản xuất</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách phiếu sản xuất
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                <div className='flex space-x-2 items-center'>
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
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button
                                        onClick={() => {
                                            router.push("/production/create")
                                            setOnPageChange(true);
                                        }}
                                        className="p-3 text-[14px] hover:bg-green-500"
                                    >
                                        Tạo phiếu sản xuất
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='overflow-x-auto'>
                            <ReceiptList name="Phiếu sản xuất" editUrl="/production/updateProduction" titles={titles} loadingData={loadingData} columns={columns} data={receipts} tableName="production" />
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
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0 left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
            <FloatingButton />
        </div>
    );
};

