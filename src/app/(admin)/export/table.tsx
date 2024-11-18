/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import ReceiptList from "@/components/list/list";
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import crypto from 'crypto';

export default function ExportTable() {
    const router = useRouter();
    const columns = [
        { name: 'id', displayName: 'Mã phiếu' },
        { name: 'batchCode', displayName: 'Lô hàng' },
        { name: 'receiptDate', displayName: 'Ngày tạo phiếu' },
        { name: 'username', displayName: 'Người tạo' },
        { name: 'type', displayName: 'Loại phiếu' },
    ];
    const [receipts, setReceipts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const titles = [
        { name: '', displayName: '', type: '' },
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [dateRange, setDateRange] = useState<[any, any]>(['', '']);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const processedFileHashes = new Set<string>();

    const getData = async (page?: number, startDate?: any, endDate?: any) => {
        try {
            setLoadingData(true);
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (startDate && endDate) {
                params.append("startDate", new Date(new Date(startDate).setDate(new Date(startDate).getDate())).toISOString());
                params.append("endDate", new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString());
            }
            params.append("receiptType", 'EXPORT');
            const url = `/WarehouseReceipt/?${params.toString()}`;
            console.log(url);
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            if (data?._embedded?.warehouseReceiptDtoList) {
                setReceipts(data._embedded.warehouseReceiptDtoList);
                setTotalPages(data.page.totalPages);
            } else {
                setReceipts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu xuất kho:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getData(currentPage, startDate, endDate);
    }, [currentPage, startDate, endDate]);

    useEffect(() => {
        setStartDate(dateRange[0]);
        setEndDate(dateRange[1]);
    }, [dateRange])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const showAlert = (data: any, fileInput: HTMLInputElement) => {
        Swal.fire({
            title: 'Xác nhận thêm danh sách sản phẩm',
            text: 'Bạn có chắc chắn muốn thêm danh sách sản phẩm này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, thêm!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleSubmit(data);
            } else {
                fileInput.value = '';
                Swal.fire('Đã hủy', 'Danh sách không được thêm.', 'info');
            }
        });
    };

    const fileToBuffer = (file: File): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                resolve(Buffer.from(arrayBuffer));
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const calculateFileHash = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');
        return hash;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) {
                throw new Error("Chưa có file nào được chọn");
            }

            const fileHash = await calculateFileHash(file);
            console.log(processedFileHashes);
            console.log(fileHash);
            console.log(processedFileHashes.has(fileHash));
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

            const workbook = new ExcelJS.Workbook();
            const fileBuffer = await fileToBuffer(file);
            await workbook.xlsx.load(fileBuffer);
            const worksheet = workbook.getWorksheet(1);

            const rows = worksheet?.rowCount;
            if (rows === 0) {
                throw new Error("File rỗng");
            }

            const processedData: Array<any> = [];

            const headers = worksheet?.getRow(1).values as string[];
            console.log(headers);

            worksheet?.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowData: { [key: string]: any } = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    rowData[headers[colNumber]] = cell.value;
                });
                processedData.push(rowData);
            });
            Swal.close();
            processedFileHashes.add(fileHash);
            const fileInput = event.target;
            showAlert(processedData, fileInput);
        } catch (error) {
            Swal.fire('Lỗi khi xử lý file', 'error');
        }
    };

    const handleSubmit = async (data: any) => {
        console.log(data);
        try {
            const response = await api.post(`/products/export/preview`, data);
            if (response.status >= 200 && response.status < 300) {
                getData(currentPage);
                Swal.fire('Đã thêm!', 'Danh sách đã được thêm.', 'success');
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    }

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
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
                        </div>
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={80} className='rounded-lg ml-0 mt-4 lg:ml-2 lg:mt-0' />
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => router.push("/export/create")}
                                        className="px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]"
                                    >
                                        Tạo phiếu sản xuất
                                        <PlusIcon />
                                    </Button>
                                    <Button
                                        className="ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]"
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                    >
                                        Import
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
                        <ReceiptList name="Phiếu xuất" editUrl="/export/updateExport" loadingData={loadingData} titles={titles} columns={columns} data={receipts} tableName="import" />
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

