/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import ReceiptList from "@/components/list/list";
import Paging from '@/components/paging/paging';
import React, { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import crypto from 'crypto';
import { ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Skeleton } from '@mui/material';
import { DatePickerWithRange } from '../expenditures/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Separator } from '@/components/ui/separator';
import SearchBar from '@/components/searchbar/searchbar';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ImportPageBreadcrumb from '@/app/(admin)/import/breadcrumb';
import { FileUp } from 'lucide-react';

export default function ImportTable() {
    const router = useRouter();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const { setBreadcrumb } = useBreadcrumbStore()

    useEffect(() => {
        setBreadcrumb(<ImportPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);
    const options = ['Tạo phiếu nhập từ sản xuất', 'Tạo phiếu nhập từ nhà cung cấp'];
    const handleClick = () => {
        if (options[selectedIndex] === 'Tạo phiếu nhập từ nhà cung cấp') {
            setOnPageChange(true);
            router.push("/import/create");
        } else {
            setOnPageChange(true);
            router.push("/import/createFromProduction");
        }
    };
    const columns = [
        { name: 'id', displayName: 'Mã phiếu' },
        { name: 'batchCode', displayName: 'Lô hàng' },
        { name: 'receiptDate', displayName: 'Ngày tạo phiếu' },
        { name: 'receiptReason', displayName: 'Lý do nhập' },
        { name: 'username', displayName: 'Người tạo' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
    const [onPageChange, setOnPageChange] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const titles = [
        { name: '', displayName: '', type: '' },
    ];
    const { toast } = useToast();
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const processedFileHashes = new Set<string>();
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });

    const calculateFileHash = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const hash = crypto.createHash('sha256').update(uint8Array).digest('hex');
        return hash;
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

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
            params.append("receiptType", 'IMPORT');
            const url = `/WarehouseReceipt/?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data?._embedded?.warehouseReceiptDtoList) {
                setReceipts(data._embedded.warehouseReceiptDtoList);
                setTotalPages(data.page.totalPages);
            } else {
                setReceipts([]);
                toast({
                    variant: 'destructive',
                    title: 'Không tìm thấy phiếu nhập kho!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000,
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách phiếu nhập kho!',
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

    const showAlert = (file: File, fileHash: string, fileInput: HTMLInputElement) => {
        Swal.fire({
            title: 'Xác nhận thêm danh sách sản phẩm',
            text: 'Bạn có chắc chắn muốn thêm danh sách sản phẩm này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, thêm!',
            cancelButtonText: 'Không',
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleSubmit(file, fileHash, fileInput);
            } else {
                fileInput.value = '';
            }
        });
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

    const downloadTemplateExcel = async () => {
        try {
            const response = await api.get('/products/generateTemplate', {
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

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handleSubmit = async (data: File, fileHash: string, fileInput: HTMLInputElement) => {
        setOnPageChange(true);
        try {
            const formData = new FormData();
            formData.append("file", data);
            const response = await api.post(`/products/import/excel`, formData);
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
                                <div className='font-bold text-[1.25rem]'>Phiếu nhập kho</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách phiếu nhập kho
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col xl:flex-row justify-between items-center xl:items-middle my-5'>
                            <div className='flex flex-col lg:flex-row items-center mt-4 xl:mt-0'>
                                <div className='flex space-x-2 md:items-center space-y-2 md:space-y-0 md:flex-row flex-col'>
                                    <SearchBar
                                        onSearch={handleSearch}
                                        loadingData={loadingData}
                                        selectOptions={[
                                            { value: 'batchCode', label: 'Mã lô hàng' }
                                        ]}
                                    />
                                    {loadingData ? (
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
                                    ) : (
                                        <DatePickerWithRange date={date} setDate={setDate} />
                                    )}
                                </div>
                            </div>
                            <div className='flex lg:flex-row flex-col items-center space-x-2 mt-2 xl:mt-0'>
                                {loadingData ? (
                                    <>
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={80} className='rounded-lg ml-0 mt-4 lg:ml-2 lg:mt-0' />
                                    </>
                                ) : (
                                    <>
                                        <ButtonGroup
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#4ba94d',
                                                '& .MuiButton-root': {
                                                    border: 'none',
                                                    '&:hover': {
                                                        backgroundColor: '#22c55e',
                                                    },
                                                },
                                            }}
                                            ref={anchorRef}
                                        >
                                            <Button
                                                className='hover:bg-green-500'
                                                onClick={handleClick}>{options[selectedIndex]}</Button>
                                            <Button
                                                className='hover:bg-green-500 rounded-r-lg rounded-l-none'
                                                aria-controls={open ? 'split-button-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-label="select merge strategy"
                                                aria-haspopup="menu"
                                                onClick={handleToggle}
                                            >
                                                <ArrowDropDownIcon />
                                            </Button>
                                        </ButtonGroup>
                                        <Popper
                                            sx={{ zIndex: 1 }}
                                            open={open}
                                            anchorEl={anchorRef.current}
                                            role={undefined}
                                            transition
                                            disablePortal
                                        >
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    style={{
                                                        transformOrigin:
                                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                                    }}
                                                >
                                                    <Paper >
                                                        <ClickAwayListener onClickAway={handleClose}>
                                                            <MenuList id="split-button-menu" autoFocusItem>
                                                                {options.map((option, index) => (
                                                                    <MenuItem
                                                                        key={option}
                                                                        disabled={index === 2}
                                                                        selected={index === selectedIndex}
                                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                ))}
                                                            </MenuList>
                                                        </ClickAwayListener>
                                                    </Paper>
                                                </Grow>
                                            )}
                                        </Popper>
                                        <Button
                                            className="p-3 text-[14px] hover:bg-green-500 lg:mt-0 mt-2"
                                            onClick={handleShowDownloadMaterial}
                                        >
                                            Nhập từ file <FileUp />
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
                            <ReceiptList name="Phiếu nhập" editUrl="/import/updateImport" titles={titles} loadingData={loadingData} columns={columns} data={receipts} tableName="import" handleClose={() => getData(currentPage, currentSearch, startDate, endDate)} />
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

