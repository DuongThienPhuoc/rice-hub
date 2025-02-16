/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import api from "@/config/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import FloatingButton from '@/components/floating/floatingButton';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ProductDetailPageBreadcrumb from '@/app/(admin)/products/[id]/breadcrumb';
import Swal from 'sweetalert2';
import { ToastAction } from '@/components/ui/toast';

const Page = ({ params }: { params: { id: number } }) => {
    const { toast } = useToast();
    const [product, setProduct] = useState<any>(null);
    const [batchProducts, setBatchProducts] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const selectOptions = [
        { value: '1', label: 'Tồn kho' },
        { value: '2', label: 'Lịch sử nhập xuất' }
    ]
    const [selected, setSelected] = useState(selectOptions[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [onPageChange, setOnPageChange] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumb(<ProductDetailPageBreadcrumb productId={params.id.toString()} />)
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

    useEffect(() => {
        if (params.id) {
            getBatch();
            getProduct();
        }
    }, [params.id]);

    const getProduct = async () => {
        try {
            const url = `/products/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            setProduct(data);
            if (!data?.id) {
                toast({
                    variant: 'destructive',
                    title: 'Lỗi khi lấy thông tin sản phẩm!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000
                })
            }
        } catch (error: any) {
            if (error.response.status === 404) {
                toast({
                    variant: 'destructive',
                    title: 'Sản phẩm không tồn tại!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Hệ thống gặp sự cố khi lấy thông tin sản phẩm!',
                    description: 'Xin vui lòng thử lại sau',
                    duration: 3000
                })
            }
        } finally {
            setLoadingData(false);
        }
    };

    const getBatch = async () => {
        try {
            const url = `/batchproducts/productId/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            if (Array.isArray(data)) {
                setBatchProducts(data);
            } else {
                setBatchProducts([]);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const renderDate = (value: any) => {
        if (value) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } else {
            return '../../....';
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    function isValidImageUrl(url: string) {
        try {
            const validUrl = new URL(url);
            console.log("test");
            console.log(/\.(jpg|jpeg|png|gif|webp|svg)$/.test(validUrl.pathname));
            return /\.(jpg|jpeg|png|gif|webp|svg)$/.test(validUrl.pathname);
        } catch {
            return false;
        }
    }

    const showAlert = async (row: any) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa quy cách này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(row);
            }
        });
    };

    const handleDelete = async (row: any) => {
        setOnPageChange(true);
        try {
            await api.delete(`/productwarehouse/delete/${row.id}`);
            setOnPageChange(false);
            toast({
                variant: 'default',
                title: 'Xóa thành công',
                description: `Quy cách đã đã được xóa thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
        } catch (error: any) {
            setOnPageChange(false);
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    return (
        <div>
            <div className='flex my-10 justify-center w-full'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin sản phẩm', 'Thông tin lô hàng'].map((label, index) => (
                                <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                    <button
                                        type='button'
                                        onClick={() => setChoice(index === 0)}
                                        className={`w-[100%] mt-5 lg:mt-10 p-[7px] ${choice === (index === 0)
                                            ? 'text-white bg-[#4ba94d] hover:bg-green-500'
                                            : 'text-black bg-[#f5f5f7] hover:bg-gray-200'
                                            }`}
                                        style={{ boxShadow: '3px 3px 5px lightgray' }}
                                    >
                                        <strong>{label}</strong>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    {choice ? (
                        loadingData ? (
                            <div className='flex flex-col lg:flex-row lg:px-10'>
                                <div className='flex-1'>
                                    <div className='mt-10 xl:px-10 flex flex-col items-center'>
                                        <Skeleton animation="wave" variant="rectangular" height={'400px'} width={'90%'} />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col lg:flex-row lg:px-10'>
                                <div className='flex-1'>
                                    <div className='mt-10 xl:px-10 flex flex-col items-center'>
                                        <img
                                            src={isValidImageUrl(product?.image) ? product.image : "https://placehold.co/400"}
                                            alt='Image'
                                            className="w-[80%] h-[auto] border-[5px] border-black object-cover"
                                        />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='m-10 mt-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã sản phẩm: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.productCode}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Tên sản phẩm: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.name}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Danh mục: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.category?.name}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Nhà sản xuất: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.supplier?.name}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mô tả: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.description ? product?.description : 'N/A'}</span>
                                    </div>

                                    <div className='flex-1'>
                                        <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Ngày tạo: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(product?.createAt)}</span>
                                        </div>
                                    </div>

                                    <div className='flex-1'>
                                        <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Quy cách: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>
                                                {product?.productWarehouses ? (
                                                    (() => {
                                                        const filteredItems = product.productWarehouses.filter(
                                                            (item: any, index: any, self: any) =>
                                                                index ===
                                                                self.findIndex(
                                                                    (t: any) =>
                                                                        t.unit === item.unit &&
                                                                        t.weightPerUnit === item.weightPerUnit &&
                                                                        item.weightPerUnit > 0
                                                                )
                                                        );

                                                        return filteredItems.length > 0 ? (
                                                            filteredItems.map((filteredItem: any, index: number) => (
                                                                <span key={index}>
                                                                    {index > 0 && ','} {filteredItem.unit} {filteredItem.weightPerUnit + 'kg'}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            'Không có quy cách'
                                                        );
                                                    })()
                                                ) : (
                                                    'Không có quy cách'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className='w-full lg:px-10'>
                            <div className='lg:mx-10 my-10 mx-5'>
                                <div className='mb-5'>
                                    <div ref={dropdownRef} className="relative text-[14px]">
                                        <div
                                            className="p-2 bg-[#4ba94d] hover:bg-green-500 flex items-center text-white font-semibold w-fit rounded-lg cursor-pointer"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            {selected.label} {isOpen ? (<ChevronUp size={20} className='ml-1' />) : (<ChevronDown size={20} className='ml-1' />)}
                                        </div>
                                        {isOpen && (
                                            <div className="absolute bg-white border border-gray-300 mt-1">
                                                {selectOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                                        onClick={() => {
                                                            setSelected(option);
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {option.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className='w-full max-h-300px overflow-auto'>
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
                                                        {selected.value === '2' ? (
                                                            <TableRow>
                                                                <TableCell><p className='font-semibold text-white'>Mã lô hàng</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Giá nhập (kg)</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Quy cách</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Số lượng</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Hình thức</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Ngày nhập/xuất</p></TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell><p className='font-semibold text-white'>STT</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Quy cách</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Số lượng</p></TableCell>
                                                                <TableCell><p className='font-semibold text-center text-white'>Hành động</p></TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableHead>
                                                    <TableBody>
                                                        {selected.value === '2' ? (
                                                            batchProducts && batchProducts.length !== 0 ? (
                                                                batchProducts.map((row: any, rowIndex: any) => (
                                                                    <TableRow key={rowIndex} className={`font-semibold bg-white`}>
                                                                        <TableCell className='font-semibold text-blue-500 hover:text-blue-300 cursor-pointer' onClick={() => router.push(`/batches/${row?.batchCode}`)}>
                                                                            {row?.batchCode}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(row?.price))}
                                                                        </TableCell>
                                                                        <TableCell>{row?.unit + ' ' + row?.weightPerUnit} kg</TableCell>
                                                                        <TableCell>{row?.quantity || 0} {row?.unit || 'kg'}</TableCell>
                                                                        <TableCell>{row?.receiptType === 'IMPORT' ? 'Nhập kho' : 'Xuất kho'}</TableCell>
                                                                        <TableCell>{renderDate(row?.date)}</TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={6}>
                                                                        <div className="my-10 mx-4 text-center text-gray-500">
                                                                            Không có dữ liệu
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        ) : (
                                                            product?.productWarehouses && product?.productWarehouses !== 0 ? (
                                                                product?.productWarehouses.map((row: any, rowIndex: any) => (
                                                                    <TableRow key={rowIndex} className={`font-semibold bg-white`}>
                                                                        <TableCell>{rowIndex + 1}</TableCell>
                                                                        <TableCell>{(row.weightPerUnit > 1 && row.unit) ? row.unit + " " + row.weightPerUnit + " kg" : 'Chưa đóng gói'}</TableCell>
                                                                        <TableCell>{row?.quantity} {row?.unit}</TableCell>
                                                                        <TableCell className='w-[150px]'>
                                                                            <div className="flex justify-center space-x-3">
                                                                                <div className="relative group w-fit">
                                                                                    <button onClick={() => showAlert(row)}>
                                                                                        <Trash2 size={18} />
                                                                                    </button>
                                                                                    <span className="absolute text-center w-[50px] transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                        Xóa
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={3}>
                                                                        <div className="my-10 mx-4 text-center text-gray-500">
                                                                            Không có dữ liệu
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center my-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                            </>
                        ) : (
                            <>
                                <Button type='button' onClick={() => {
                                    router.push(`/products/update/${params.id}`)
                                    setOnPageChange(true)
                                }} className='px-5 mr-2 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Sửa</strong>
                                </Button>
                                <Button type='button' onClick={() => {
                                    window.history.back();
                                    setOnPageChange(true)
                                }} className='px-5 ml-2 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
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
        </div >
    );
};

export default Page;