/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import api from "../../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import { Paper, Skeleton, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { CheckSquare, CircleX, PenSquare, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

const Page = ({ params }: { params: { id: number } }) => {
    const router = useRouter();
    const [selectedRow, setSelectedRow] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [inventory, setInventory] = useState<any>([]);
    const { toast } = useToast();

    useEffect(() => {
        getInventory();
    }, []);

    const getInventory = async () => {
        setLoadingData(true);
        try {
            const url = `/inventory/getInventory/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            setInventory(data);
        } catch (error) {
            console.error("Lỗi khi lấy phiếu kiểm kho:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async () => {
        Swal.fire({
            title: 'Xác nhận phiếu kiểm kho',
            text: 'Bạn có chắc chắn muốn xác nhận phiếu kiểm kho này, một khi đã xuất sẽ cập nhập số lượng mới lên hệ thống và không thể thay đổi nữa.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xác nhận',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedInventoryDetails = inventory?.inventoryDetails?.map((item: any) => ({
                        ...item,
                        productId: item.product.id,
                    }));

                    const url = `/inventory/confirm-add-to-inventory/${params.id}`
                    const response = await api.post(url, {
                        id: params.id,
                        warehouseId: inventory?.warehouse?.id,
                        inventoryDetails: updatedInventoryDetails,
                    });
                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: 'Xác nhận thành công',
                            description: `Phiếu kiểm kho đã được xác nhận thành công`,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                            duration: 3000
                        })
                        router.push("/inventory");
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Xác nhận phiếu kiểm kho thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Xác nhận phiếu kiểm kho thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            } else {
                Swal.fire('Đã hủy', 'Phiếu kiểm kho không được xác nhận.', 'info');
            }
        });
    }

    const handleFieldChange = (fieldName: string, value: any, index: number) => {
        setInventory((prevData: any) => ({
            ...prevData,
            inventoryDetails: prevData.inventoryDetails.map((item: any, i: number) =>
                i === index
                    ? { ...item, [fieldName]: value }
                    : item
            ),
        }));
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/inventory/delete/${params.id}`);
            toast({
                variant: 'default',
                title: 'Xóa thành công',
                description: `Phiếu kiểm kho đã được xóa thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
            getInventory();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const showAlert = async () => {
        if (inventory?.status === 'CANCELED') {
            Swal.fire({
                title: 'Xác nhận xóa vĩnh viễn',
                text: `Phiếu này đã bị hủy trước đó, Nếu tiếp tục xóa thì sẽ không thể khôi phục. Bạn có muốn tiếp tục?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Không, hủy!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete();
                } else {
                    Swal.fire('Đã hủy', `Phiếu kiểm kho không bị xóa.`, 'info');
                }
            });
        } else {
            Swal.fire({
                title: 'Xác nhận xóa',
                text: `Bạn có chắc chắn muốn xóa phiếu này?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Không, hủy!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete();
                } else {
                    Swal.fire('Đã hủy', `Phiếu kiểm kho không bị xóa.`, 'info');
                }
            });
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

    return (
        <div>
            <div className='flex my-10 justify-center lg:px-5 w-full'>
                <div className='w-[100%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin phiếu kiểm kho'].map((label, index) => (
                                <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                    <div
                                        className={`w-[100%] text-center mt-5 lg:mt-10 p-[7px] text-white bg-black hover:bg-[#1d1d1fca]}`}
                                        style={{ boxShadow: '3px 3px 5px lightgray' }}
                                    >
                                        <strong>{label}</strong>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className='flex flex-col mt-10 lg:flex-row lg:px-10'>
                        {loadingData ? (
                            <>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã phiếu: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{inventory?.inventoryCode}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Người tạo phiếu: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{inventory?.createBy?.fullName}</span>
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(inventory?.inventoryDate)}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Kho: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{inventory?.warehouse?.name}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Trạng thái: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>
                                            {inventory?.status === 'COMPLETED' && 'Hoàn thành'}
                                            {inventory?.status === 'CANCELED' && 'Đã hủy'}
                                            {inventory?.status === 'PENDING' && 'Đang xử lý'}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='lg:px-10 w-full'>
                        <div className='lg:mx-10 mx-5'>
                            {loadingData ? (
                                <div className="w-full">
                                    <Skeleton animation="wave" variant="text" height={'30px'} width={200} className='mb-5' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex mt-2">
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className='flex justify-between lg:flex-row flex-col-reverse items-center mb-5'>
                                        <>
                                            <p className='font-bold lg:mt-0 mt-5'>Danh sách sản phẩm: </p>
                                            <div className='flex justify-end items-center'>
                                                {inventory?.status === 'PENDING' || inventory?.status === 'CANCELED' && (
                                                    <Button onClick={() => showAlert()} className='px-5 py-3 mr-2 text-[14px] hover:bg-[#1d1d1fca]'>
                                                        Hủy phiếu
                                                        <CircleX />
                                                    </Button>
                                                )}
                                                {inventory?.status === 'PENDING' && (
                                                    <Button onClick={() => handleSubmit()} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                                        Xác nhận phiếu
                                                        <CheckSquare />
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    </div>
                                    <div className='overflow-x-auto max-h-[400px]'>
                                        <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                                            <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Mã sản phẩm</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Tên sản phẩm</TableCell>
                                                        <TableCell rowSpan={1} colSpan={2} align="center" className='font-semibold'>Quy cách</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Số lượng trong hệ thống</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Số lượng thực tế</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Số lượng chênh lệch</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold w-[150px]'>Mô tả</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>#</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="center" className='font-semibold'>
                                                            Loại
                                                        </TableCell>
                                                        <TableCell align="center" className='font-semibold'>
                                                            Trọng lượng
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {inventory?.inventoryDetails && inventory.inventoryDetails.map((product: any, index: any) => (
                                                        index === selectedRow ? (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="center" onClick={() => router.push(`/products/${product.product.id}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                                    {product.product.productCode}
                                                                </TableCell>
                                                                <TableCell align="center">{product.product.name}</TableCell>
                                                                <TableCell align="center">{product?.unit}</TableCell>
                                                                <TableCell align="center">{product?.weightPerUnit} kg</TableCell>
                                                                <TableCell align="center">{product?.systemQuantity}</TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'number'}
                                                                        className='w-[100px]'
                                                                        inputProps={{ min: 0 }}
                                                                        onChange={(e) => {
                                                                            handleFieldChange('quantity', Number(e.target.value), index)
                                                                        }}
                                                                        value={product?.quantity}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label={'Số lượng'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">{product?.quantity_discrepancy}</TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'text'}
                                                                        className='w-[120px]'
                                                                        onChange={(e) => {
                                                                            handleFieldChange('description', e.target.value, index)
                                                                        }}
                                                                        value={product?.description}
                                                                        multiline
                                                                        rows={2}
                                                                        label={'Mô tả'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <div className='flex justify-center items-center'>
                                                                        <div className='relative group'>
                                                                            <X onClick={() => setSelectedRow(null)} size={18} className='cursor-pointer hover:text-red-500' />
                                                                            <span className="absolute w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Hủy
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="center" onClick={() => router.push(`/products/${product?.product?.id}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                                    {product?.product?.productCode}
                                                                </TableCell>
                                                                <TableCell align="center">{product?.product?.name}</TableCell>
                                                                <TableCell align="center">{product?.unit}</TableCell>
                                                                <TableCell align="center">{product?.weightPerUnit} kg</TableCell>
                                                                <TableCell align="center">{product?.systemQuantity}</TableCell>
                                                                <TableCell align="center">{product?.quantity}</TableCell>
                                                                <TableCell align="center">{product?.quantity_discrepancy}</TableCell>
                                                                <TableCell align="center">{product?.description || 'N/A'}</TableCell>
                                                                <TableCell align="center">
                                                                    <div className='flex justify-center items-center'>
                                                                        <div className='relative group'>
                                                                            <PenSquare onClick={() => setSelectedRow(index)} size={18} className='cursor-pointer hover:text-blue-500' />
                                                                            <span className="absolute w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Sửa
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-center my-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 py-3' />
                            </>
                        ) : (
                            <>
                                <Button type='button' onClick={() => router.push('/inventory')} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Page;
