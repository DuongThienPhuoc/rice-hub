/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import ReceiptList from "@/components/list/list";
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '../../../api/firebaseConfig';
import { Menu, MenuItem } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

export default function ReceiptTable() {
    const router = useRouter();
    const storage = getStorage(firebase);
    const columns = [
        { name: 'id', displayName: 'Mã phiếu' },
        { name: 'receiptType', displayName: 'Loại phiếu' },
        { name: 'receiptDate', displayName: 'Ngày tạo phiếu' },
        { name: 'batchCode', displayName: 'Lô hàng' },
        { name: 'username', displayName: 'Người tạo' },
        { name: 'type', displayName: 'Lý do xuất hàng' },
    ];
    const [receipts, setReceipts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const titles = [
        { name: '', displayName: '', type: '' },
    ];
    const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        handleClose();
        router.push(path);
    };

    const getData = async (page?: number, startDate?: any, endDate?: any) => {
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
            const url = `/WarehouseReceipt/?${params.toString()}`;
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
            console.error("Lỗi khi lấy danh sách phiếu nhập kho:", error);
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

    const uploadImageToFirebase = async (imageBuffer: Buffer, fileName: string): Promise<string> => {
        try {
            const fileRef = ref(storage, `images/${fileName}`);
            await uploadBytes(fileRef, imageBuffer);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            return "";
        }
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) {
                throw new Error("No file selected");
            }

            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we process your file.',
                allowOutsideClick: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            const workbook = new ExcelJS.Workbook();
            const fileBuffer = await fileToBuffer(file);
            await workbook.xlsx.load(fileBuffer);
            const worksheet = workbook.getWorksheet(1);

            const imageMap: { [rowNumber: number]: string } = {};
            const images = workbook.model.media;

            const rows = worksheet?.rowCount;
            if (rows === 0) {
                throw new Error("The worksheet contains no rows");
            }

            const imageRowNumbers = Array.from({ length: images.length }, (_, i) => i + 2);

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const { buffer, name, extension } = image;

                if (buffer) {
                    const fileName = `${name}.${extension}`;
                    const firebaseUrl = await uploadImageToFirebase(Buffer.from(buffer), fileName);

                    const rowNumber = imageRowNumbers[i];
                    if (rows && rowNumber <= rows) {
                        imageMap[rowNumber] = firebaseUrl;
                    }
                }
            }

            const processedData: Array<any> = [];

            const headers = worksheet?.getRow(1).values as string[];

            worksheet?.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowData: { [key: string]: any } = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (colNumber === 4 && imageMap[rowNumber]) {
                        rowData[headers[colNumber]] = imageMap[rowNumber];
                    } else {
                        rowData[headers[colNumber]] = cell.value;
                    }
                });
                processedData.push(rowData);
            });

            Swal.close();

            const fileInput = event.target;
            showAlert(processedData, fileInput);
        } catch (error) {
            console.error("Error processing file:", error);
            Swal.fire('Error processing file', 'error');
        }
    };

    const handleSubmit = async (data: any) => {
        console.log(data);
        try {
            const response = await api.post(`/products/import`, data);
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
        <div>
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
                            <Button
                                onClick={handleClick}
                                className="px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]"
                            >
                                Tạo phiếu
                                {anchorEl ? <ExpandLess /> : <ExpandMore />}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => handleMenuItemClick("/receipts/import/create")}>Tạo phiếu nhập</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("/receipts/export/create")}>Tạo phiếu xuất</MenuItem>
                            </Menu>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".xlsx, .xls"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <Button
                                className="ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]"
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                Import
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <ReceiptList name="Phiếu nhập/xuất" editUrl="/import/updateImport" titles={titles} columns={columns} data={receipts} tableName="import" />
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

