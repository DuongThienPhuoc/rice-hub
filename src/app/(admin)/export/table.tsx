/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import ReceiptList from "@/components/list/list";
import Paging from '@/components/paging/paging';
import React, { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { FileUp, PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { DateRange } from 'react-day-picker';
import SearchBar from '@/components/searchbar/searchbar';
import { DatePickerWithRange } from '../expenditures/date-range-picker';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ExportPageBreadcrumb from '@/app/(admin)/export/breadcrumb';
import Swal from 'sweetalert2';
import crypto from 'crypto';
import { ToastAction } from '@/components/ui/toast';

export default function ExportTable() {
    const router = useRouter();
    const columns = [
        { name: 'id', displayName: 'Mã phiếu' },
        { name: 'batchCode', displayName: 'Lô / Đơn hàng' },
        { name: 'receiptDate', displayName: 'Ngày tạo phiếu' },
        { name: 'receiptReason', displayName: 'Lý do xuất' },
        { name: 'username', displayName: 'Người tạo' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
    const [onPageChange, setOnPageChange] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const titles = [
        { name: '', displayName: '', type: '' },
    ];
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const { toast } = useToast();
    const [loadingData, setLoadingData] = useState(true);
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const { setBreadcrumb } = useBreadcrumbStore()
    const processedFileHashes = new Set<string>();

    useEffect(() => {
        setBreadcrumb(<ExportPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);

    const getData = async (page?: number, search?: { field?: string, query?: string }, startDate?: any, endDate?: any) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (startDate && endDate) {
                params.append("startDate", new Date(new Date(startDate).setDate(new Date(startDate).getDate())).toISOString());
                params.append("endDate", new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            params.append("receiptType", 'EXPORT');
            const url = `/WarehouseReceipt/?${params.toString()}`;
            console.log(url);
            const response = await api.get(url);
            const data = response.data;
            if (data?._embedded?.warehouseReceiptDtoList) {
                setReceipts(data._embedded.warehouseReceiptDtoList);
                setTotalPages(data.page.totalPages);
            } else {
                setReceipts([]);
                toast({
                    variant: 'destructive',
                    title: 'Không tìm thấy phiếu xuất kho!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000,
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách phiếu xuất kho!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getData(currentPage, currentSearch, startDate, endDate);
    }, [currentPage, currentSearch, startDate, endDate]);

    useEffect(() => {
        setStartDate(date?.from || null);
        setEndDate(date?.to || null);
    }, [date]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const calculateFileHash = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const hash = crypto.createHash('sha256').update(uint8Array).digest('hex');
        return hash;
    };

    const showAlert = (file: File, fileHash: string, fileInput: HTMLInputElement) => {
        Swal.fire({
            title: 'Xác nhận xuất danh sách sản phẩm',
            text: 'Bạn có chắc chắn muốn xuất danh sách sản phẩm này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xuất!',
            cancelButtonText: 'Không',
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleSubmit(file, fileHash, fileInput);
            } else {
                fileInput.value = '';
            }
        });
    };

    const handleSubmit = async (data: File, fileHash: string, fileInput: HTMLInputElement) => {
        setOnPageChange(true);
        try {
            const formData = new FormData();
            formData.append("file", data);
            const response = await api.post(`/products/export/excel`, formData);
            if (response.status >= 200 && response.status < 300) {
                getData(currentPage);
                toast({
                    variant: 'default',
                    title: 'Tạo thành công',
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    description: `Lô hàng đã được tạo thành công`,
                    duration: 3000,
                })
                processedFileHashes.add(fileHash);
                setOnPageChange(false);
                fileInput.value = '';
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Tạo thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    duration: 3000,
                })
                setOnPageChange(false);
                fileInput.value = '';
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000,
            })
            setOnPageChange(false);
            fileInput.value = '';
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) {
                throw new Error("Chưa có file nào được chọn");
            }

            const fileHash = await calculateFileHash(file);
            if (processedFileHashes.has(fileHash)) {
                Swal.fire('File đã được nhập', 'Vui lòng chọn file khác', 'warning');
                return;
            }

            Swal.fire({
                title: 'Đang xử lý...',
                text: 'Vui lòng chờ, dữ liệu đang được xử lí.',
                allowOutsideClick: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });
            showAlert(file, fileHash, event.target);
        } catch (error) {
            Swal.fire('Lỗi khi xử lý file', 'error');
        }
    };

    const downloadTemplateExcel = async () => {
        try {
            const response = await api.get('/products/generateExportTemplate', {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: response.headers['content-type'],
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'template.xlsx';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the template:', error);
        }
    };

    const handleShowDownloadMaterial = () => {
        Swal.fire({
            title: 'Bạn đã có mẫu file excel chưa?',
            text: "Nếu chưa, bạn có thể tải xuống ở bên dưới.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Tải xuống mẫu',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                downloadTemplateExcel();
            } else {
                document.getElementById("fileInput")?.click();
            }
        });
    };

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full'>
                    <div className='p-5 bg-white rounded-lg'>
                        {loadingData ? (
                            <div className='mb-5'>
                                <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                                <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                            </div>
                        ) : (
                            <div className="space-y-2 mb-5">
                                <div className='font-bold text-[1.25rem]'>Phiếu xuất kho</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách phiếu xuất kho
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />

                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                <div className='flex space-x-2 md:items-center space-y-2 md:space-y-0 md:flex-row flex-col'>
                                    <SearchBar
                                        onSearch={handleSearch}
                                        loadingData={loadingData}
                                        selectOptions={[
                                            { value: 'batchCode', label: 'Mã lô hàng' },
                                            { value: 'orderCode', label: 'Mã đơn hàng' }
                                        ]}
                                    />
                                    {loadingData ? (
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
                                    ) : (
                                        <DatePickerWithRange date={date} setDate={setDate} />
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-row items-center space-x-2 mt-2 lg:mt-0'>
                                {loadingData ? (
                                    <>
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={80} className='rounded-lg ml-0 mt-4 lg:ml-2 lg:mt-0' />
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => {
                                                router.push("/export/create")
                                                setOnPageChange(true)
                                            }}
                                            className="px-3 py-3 text-[14px] hover:bg-green-500"
                                        >
                                            Tạo phiếu xuất
                                            <PlusIcon />
                                        </Button>
                                        <Button
                                            className="px-3 py-3 text-[14px] hover:bg-green-500"
                                            onClick={handleShowDownloadMaterial}
                                        >
                                            Xuất từ file <FileUp />
                                        </Button>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept=".xlsx, .xls"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                        <div className='overflow-x-auto'>
                            <ReceiptList name="Phiếu xuất" editUrl="/export/updateExport" loadingData={loadingData} titles={titles} columns={columns} data={receipts} tableName="import" handleClose={() => getData(currentPage, currentSearch, startDate, endDate)} />
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

