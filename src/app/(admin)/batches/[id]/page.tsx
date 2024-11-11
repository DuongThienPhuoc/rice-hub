/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox, Paper, Skeleton, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PenSquare, Upload, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

interface RowData {
    [key: string]: any;
}

const Page = ({ params }: { params: { id: string } }) => {
    const { toast } = useToast();
    const [batch, setBatch] = useState<any>(null);
    const router = useRouter();
    const [products, setProducts] = useState<RowData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [tempDescription, setTempDescription] = useState<any>(null);
    const [tempQuantity, setTempQuantity] = useState<any>(null);
    const [tempUnit, setTempUnit] = useState<any>(null);
    const [tempPrice, setTempPrice] = useState<any>(null);
    const [tempWeightPerUnit, setTempWeightPerUnit] = useState<any>(null);

    const handleSelectProduct = (productCode: any) => {
        setSelectedProducts((prevSelected: any) =>
            prevSelected.includes(productCode)
                ? prevSelected.filter((code: any) => code !== productCode)
                : [...prevSelected, productCode]
        );
    };

    const handleUpdate = async (product: any) => {
        try {
            const response = await api.put(`/batchproducts/update?batchProductId${product.id}`, {
                quantity: tempQuantity ? tempQuantity : product.quantity,
                weightPerUnit: tempWeightPerUnit ? tempWeightPerUnit : product.weightPerUnit,
                Unit: tempUnit ? tempUnit : product.unit,
                price: tempPrice ? tempPrice : product.price,
                description: tempDescription ? tempDescription : product.description,
            });
            if (response.status >= 200 && response.status < 300) {
                alert(`Cập nhật thành công`);
                getBatch();
                getProducts();
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    }

    const handleDelete = async () => {
        if (selectedProducts.length < 1) {
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: 'Danh sách rỗng! Vui lòng chọn sản phẩm để xóa.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa những sản phẩm này khỏi lô hàng, một khi đã xóa sẽ không thể khôi phục nữa.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const productData = {
                    batProductId: selectedProducts.map((product: any) => product?.id)
                };

                try {
                    const url = `/export/deleteMany`
                    const response = await api.delete(url, { data: productData });
                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: 'Xóa thành công',
                            description: `Sản phẩm đã được xóa khỏi lô hàng.`,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                            duration: 3000
                        })
                        getBatch();
                        getProducts();
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Xóa thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Xóa thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            } else {
                Swal.fire('Đã hủy', 'Sản phẩm không bị xóa khỏi lô hàng.', 'info');
            }
        });
    }

    const handleSubmit = async (type: string) => {
        if (selectedProducts.length < 1) {
            toast({
                variant: 'destructive',
                title: type === 'import' ? 'Nhập kho thất bại' : 'Xuất kho thất bại',
                description: 'Danh sách rỗng! Vui lòng chọn sản phẩm để nhập.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        Swal.fire({
            title: type === 'import' ? 'Xác nhận nhập kho' : 'Xác nhận xuất kho',
            text: type === 'import' ? 'Bạn có chắc chắn muốn nhập kho những sản phẩm này, một khi đã nhập sẽ không thể thay đổi nữa.'
                : 'Bạn có chắc chắn muốn xuất kho những sản phẩm này, một khi đã xuất sẽ không thể thay đổi nữa.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: type === 'import' ? 'Có, nhập!' : 'Có, xuất',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const productData = selectedProducts.map((product: any) => ({
                    productId: product?.product?.id,
                    unit: product?.unit,
                    weighPerUnit: product?.weightPerUnit,
                    supplierId: product?.product?.supplier?.id
                }));

                try {
                    const url = type === 'import' ? `/products/confirm-add-to-warehouse/${batch?.id}` : `/export/confirm/${batch?.id}`
                    const response = await api.post(url, productData);
                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: type === 'import' ? 'Nhập kho thành công' : 'Xuất kho thành công',
                            description: type === 'import' ? `Lô hàng đã được nhập thành công` : `Lô hàng đã được xuất thành công`,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                            duration: 3000
                        })
                        router.push("/products");
                    } else {
                        toast({
                            variant: 'destructive',
                            title: type === 'import' ? 'Nhập kho thất bại' : 'Xuất kho thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: type === 'import' ? 'Nhập kho thất bại' : 'Xuất kho thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            } else {
                if (type === 'import') {
                    Swal.fire('Đã hủy', 'Lô hàng không được nhập.', 'info');
                } else {

                    Swal.fire('Đã hủy', 'Lô hàng không được xuất.', 'info');
                }
            }
        });
    }

    const getBatch = async () => {
        setLoadingData(true);
        try {
            const url = `/batches/batchCode/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            setBatch(data);
        } catch (error) {
            console.error("Error fetching batch:", error);
        } finally {
            setLoadingData(false)
        }
    };

    useEffect(() => {
        if (params.id) {
            getProducts();
            getBatch();
        }
    }, [params.id]);

    const getProducts = async () => {
        try {
            const url = `/batchproducts/batchCode/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
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

    const hasUnaddedProducts = products.some((product) => !product.added);

    useEffect(() => {
        setTempDescription(null);
        setTempQuantity(null);
        setTempUnit(null);
        setTempPrice(null);
        setTempWeightPerUnit(null);
    }, [selectedRow])

    return (
        <div>
            <div className='flex my-10 justify-center px-5 w-full'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin lô hàng'].map((label, index) => (
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
                                        <span className='font-bold flex-1'>Mã lô: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{batch?.batchCode}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Người nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{batch?.batchCreator.fullName}</span>
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(batch?.importDate)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='lg:px-10 w-full lg:mt-0 mt-10'>
                        <div className='mx-10'>
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
                                        {batch?.receiptType === 'IMPORT' ? (
                                            <>
                                                <p className='font-bold lg:mt-0 mt-5'>Danh sách sản phẩm: </p>
                                                <div className='flex justify-end items-center'>
                                                    <Button type='button' onClick={handleDelete} className='px-5 py-3 mr-2 text-[14px] hover:bg-[#1d1d1fca]'>
                                                        <strong>Xóa sản phẩm</strong>
                                                    </Button>
                                                    <Button type='button' onClick={() => handleSubmit('import')} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                                        <strong>Xác nhận nhập kho</strong>
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className='font-bold lg:mt-0 mt-5'>Danh sách nguyên liệu: </p>
                                                <Button type='button' onClick={() => handleSubmit('export')} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                                    <strong>Xác nhận xuất kho</strong>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                                            <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell rowSpan={2} padding="checkbox">
                                                            {hasUnaddedProducts && (
                                                                <Checkbox
                                                                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.filter((product) => !product.added).length}
                                                                    checked={selectedProducts.length === products.filter((product) => !product.added).length}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedProducts(products.filter((product) => product.added === false));
                                                                        } else {
                                                                            setSelectedProducts([]);
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Mã sản phẩm</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Tên sản phẩm</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Giá nhập</TableCell>
                                                        <TableCell rowSpan={1} colSpan={2} align="center" className='font-semibold'>Quy cách</TableCell>
                                                        <TableCell rowSpan={2} align="center" className='font-semibold'>Số lượng</TableCell>
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
                                                    {products && products.map((product, index) => (
                                                        index === selectedRow ? (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                {product.added === true ? (
                                                                    <TableCell></TableCell>
                                                                ) : (
                                                                    <TableCell padding="checkbox">
                                                                        <Checkbox
                                                                            checked={selectedProducts.includes(product)}
                                                                            onChange={() => handleSelectProduct(product)}
                                                                        />
                                                                    </TableCell>
                                                                )}
                                                                <TableCell align="center" onClick={() => router.push(`/products/${product.product.id}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                                    {product.product.productCode}
                                                                </TableCell>
                                                                <TableCell align="center">{product.product.name}</TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'number'}
                                                                        className='w-[100px]'
                                                                        inputProps={{ min: 1 }}
                                                                        onChange={(e) => setTempPrice(Number(e.target.value))}
                                                                        value={tempPrice || product.price}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label={'Giá nhập'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'text'}
                                                                        className='w-[100px]'
                                                                        inputProps={{ min: 1 }}
                                                                        onChange={(e) => setTempUnit(e.target.value)}
                                                                        value={tempUnit || product.unit}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label={'Loại'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'number'}
                                                                        className='w-[100px]'
                                                                        inputProps={{ min: 1 }}
                                                                        onChange={(e) => setTempWeightPerUnit(Number(e.target.value))}
                                                                        value={tempWeightPerUnit || product.weightPerUnit}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label={'Trọng lượng'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'number'}
                                                                        className='w-[100px]'
                                                                        inputProps={{ min: 1 }}
                                                                        onChange={(e) => setTempQuantity(Number(e.target.value))}
                                                                        value={tempQuantity || product.quantity}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label={'Số lượng'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type={'text'}
                                                                        className='w-[120px]'
                                                                        inputProps={{ min: 1 }}
                                                                        onChange={(e) => setTempDescription(e.target.value)}
                                                                        value={tempDescription || product.description}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        multiline
                                                                        rows={3}
                                                                        label={'Mô tả'}
                                                                        variant="standard" />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <div className='flex justify-center items-center space-x-2'>
                                                                        <div className='relative group'>
                                                                            <Upload onClick={() => handleUpdate(product)} size={18} className='cursor-pointer hover:text-green-500' />
                                                                            <span className="absolute w-[70px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Cập nhật
                                                                            </span>
                                                                        </div>
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
                                                                {product.added === true ? (
                                                                    <TableCell></TableCell>
                                                                ) : (

                                                                    <TableCell padding="checkbox">
                                                                        <Checkbox
                                                                            checked={selectedProducts.includes(product)}
                                                                            onChange={() => handleSelectProduct(product)}
                                                                        />
                                                                    </TableCell>
                                                                )}
                                                                <TableCell align="center" onClick={() => router.push(`/products/${product.product.id}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                                    {product.product.productCode}
                                                                </TableCell>
                                                                <TableCell align="center">{product.product.name}</TableCell>
                                                                <TableCell align="center">{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}</TableCell>
                                                                <TableCell align="center">{product.unit}</TableCell>
                                                                <TableCell align="center">{product.weightPerUnit} kg</TableCell>
                                                                <TableCell align="center">{product.quantity}</TableCell>
                                                                <TableCell align="center">{product.description}</TableCell>
                                                                <TableCell align="center">
                                                                    <div className='flex justify-center items-center space-x-2'>
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
                                <Button type='button' onClick={() => router.push(`${batch?.receiptType === "IMPORT" ? '/import' : '/export'}`)} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
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