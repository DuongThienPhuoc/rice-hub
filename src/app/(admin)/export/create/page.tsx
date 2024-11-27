/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/config/axiosConfig";
import { Autocomplete, Skeleton, TextField, Paper } from '@mui/material';
import { PenSquare, PlusCircle, Trash2, X } from 'lucide-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface RowData {
    [key: string]: any;
}

interface FormDataItem {
    productName: string;
    quantity: number;
    categoryName: string;
    categoryId: string;
    supplierId: number;
    supplierName: string;
    warehouseId: number;
    warehouseName: string;
    weightPerUnit: number;
    unit: string;
    unitList: any;
    selectedUnit: any;
}

const Page = () => {
    const router = useRouter();
    const [products, setProducts] = useState<RowData[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState<RowData | null>(null);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<RowData | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<RowData | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<RowData | null>(null);
    const [formData, setFormData] = useState<FormDataItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        console.log(selectedProduct);
        if (selectedProduct) {
            setProductName(selectedProduct?.name || '');
            setSelectedCategory(selectedProduct?.category || null);
            setSelectedSupplier(selectedProduct?.supplier || null);
            setSelectedWarehouse(selectedProduct?.productWarehouses[0]?.warehouse || null);
            setSelectedUnit(selectedProduct?.productWarehouses[0]);
        } else {
            setProductName('');
            setSelectedProduct(null);
            setSelectedSupplier(null);
            setSelectedCategory(null);
            setSelectedWarehouse(null);
            setSelectedUnit(null);
        }
    }, [selectedProduct])

    const getProducts = async () => {
        try {
            const url = `/products/`;
            const response = await api.get(url);
            const data = response.data;
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAddItemToForm = () => {
        if (productName === '') {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }

        if (quantity === 0) {
            alert('Số lượng không hợp lệ');
            return;
        }

        if (!selectedCategory) {
            alert('Vui lòng chọn danh mục');
            return;
        }

        if (!selectedSupplier) {
            alert('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (!selectedWarehouse) {
            alert('Vui lòng chọn kho');
            return;
        }
        const newItem: FormDataItem = {
            productName: productName,
            quantity: quantity,
            categoryName: selectedCategory?.name,
            categoryId: selectedCategory?.id,
            supplierName: selectedSupplier?.name,
            supplierId: selectedSupplier?.id,
            warehouseName: selectedWarehouse?.name,
            warehouseId: selectedWarehouse?.id,
            weightPerUnit: selectedUnit?.weightPerUnit,
            unit: selectedUnit?.unit,
            unitList: selectedProduct?.productWarehouses,
            selectedUnit: selectedUnit
        };
        setFormData(prevFormData => [...prevFormData, newItem]);
        setSelectedProduct(null);
        setSelectedCategory(null);
        setSelectedSupplier(null);
        setSelectedWarehouse(null);
        setSelectedUnit(null);
        setProductName('');
        setQuantity(0);
    }

    const handleSubmit = async () => {

        if (formData.length < 1) {
            alert("Danh sách rỗng! Vui lòng thêm sản phẩm.");
            return;
        }

        try {
            const response = await api.post(`/products/export/preview`, formData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Lô hàng đã được xuất thành công`);
                router.push("/export");
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };

    const handleDeleteItem = (index: number) => {
        setFormData(prevFormData => prevFormData.filter((_, i) => i !== index));
    };

    useEffect(() => {
        console.log(formData)
    }, [formData])

    const handleFieldChange = (fieldName: any, fieldValue: any, index: any) => {
        setFormData(prevFormData =>
            prevFormData.map((item, i) =>
                i === index
                    ? { ...item, [fieldName]: fieldValue }
                    : item
            )
        );
    };

    return (
        <div>
            <div className='flex my-10 justify-center w-full'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    {loadingData ? (
                        <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                    ) : (
                        <div
                            className={`w-[100%] mt-5 text-center lg:mt-10 p-[7px] text-white bg-[#4ba94d]`}
                            style={{ boxShadow: '3px 3px 5px lightgray' }}
                        >
                            <strong>Thông tin phiếu xuất</strong>
                        </div>
                    )}
                    {loadingData ? (
                        <div className='mt-10 lg:px-10 px-2 flex lg:w-[50%] w-full'>
                            <div className="m-5 flex flex-col lg:flex-row items-center w-full">
                                <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-[200px] w-[100%] rounded-lg' />
                                <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-[300px] w-[100%] lg:mx-5 my-4 rounded-lg' />
                            </div>
                        </div>
                    ) : (
                        <div className='mt-10 lg:px-10 px-2 flex lg:w-[50%] w-full'>
                            <div className='m-5 flex-1 flex flex-col lg:flex-row lg:items-center'>
                                <span className='font-bold flex-[2] pt-4'>Chọn sản phẩm: </span>
                                <Autocomplete
                                    className='flex-[4] lg:mx-5 my-4 lg:my-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                    disablePortal
                                    options={products}
                                    getOptionLabel={(option) => option.category.name + " " + option.name + " (" + option.supplier.name + ")"}
                                    sx={{ width: 300 }}
                                    ListboxProps={{ style: { maxHeight: '200px' } }}
                                    onChange={(event, newValue) => setSelectedProduct(newValue)}
                                    renderInput={(params) => <TextField {...params} variant='standard' label="Tìm kiếm sản phẩm" />}
                                />
                            </div>
                        </div>
                    )}
                    <div className='lg:px-10 mt-5 px-2 overflow-x-auto'>
                        {loadingData ? (
                            <div className="w-full">
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-t-lg' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-2' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-b-lg mt-2' />
                            </div>
                        ) : (
                            <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                    <TableHead className='bg-[#0090d9]'>
                                        <TableRow>
                                            <TableCell align='center' className={`w-[5%]`}>
                                                <p className='font-semibold text-white'>
                                                    STT
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[19%]`}>
                                                <p className='font-semibold text-white'>
                                                    Tên sản phẩm
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>
                                                    Số lượng
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[15%]`}>
                                                <p className='font-semibold text-white'>
                                                    Quy cách
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>
                                                    Danh mục
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[15%]`}>
                                                <p className='font-semibold text-white'>
                                                    Nhà cung cấp
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[15%]`}>
                                                <p className='font-semibold text-white'>
                                                    Kho
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className="w-[5%]"><p className='font-semibold text-white'>#</p></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} className='p-2'>
                                                <TextField
                                                    type={'text'}
                                                    className='w-full'
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: selectedProduct !== null,
                                                    }}
                                                    onChange={(e) => setProductName(e.target.value)}
                                                    value={productName}
                                                    label={'Tên sản phẩm'}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <TextField
                                                    inputProps={{ min: 0 }}
                                                    type={'number'}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    className='w-full'
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    value={quantity}
                                                    label={'Số lượng'}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <Autocomplete
                                                    className='w-full'
                                                    options={
                                                        selectedProduct?.productWarehouses
                                                            ? selectedProduct.productWarehouses.filter(
                                                                (item: any, index: any, self: any) =>
                                                                    index ===
                                                                    self.findIndex(
                                                                        (t: any) => t.unit === item.unit && t.weightPerUnit === item.weightPerUnit
                                                                    )
                                                            )
                                                            : []
                                                    }
                                                    disablePortal
                                                    value={selectedUnit}
                                                    onChange={(event, newValue) => {
                                                        setSelectedUnit(newValue)
                                                    }}
                                                    getOptionLabel={(option: any) => `${option.unit} ${option.weightPerUnit}kg`}
                                                    renderInput={(params) => <TextField {...params}
                                                        variant='standard' label="Quy cách" />}
                                                />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                {!selectedProduct ? (
                                                    <Autocomplete
                                                        className='w-full'
                                                        options={[]}
                                                        disablePortal
                                                        readOnly
                                                        renderInput={(params) => <TextField {...params}
                                                            disabled variant='standard' label="Danh mục" />}
                                                    />
                                                ) : (
                                                    <TextField
                                                        type={'text'}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        className='w-full'
                                                        InputLabelProps={{
                                                            shrink: selectedProduct !== null,
                                                        }}
                                                        value={selectedCategory?.name}
                                                        label={'Danh mục'}
                                                        variant="standard" />
                                                )}
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                {!selectedProduct ? (
                                                    <Autocomplete
                                                        className='w-full'
                                                        options={[]}
                                                        disablePortal
                                                        readOnly
                                                        renderInput={(params) => <TextField {...params} disabled variant='standard' label="Nhà cung cấp" />}
                                                    />
                                                ) : (
                                                    <TextField
                                                        type={'text'}
                                                        className='w-full'
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: selectedProduct !== null,
                                                        }}
                                                        value={selectedSupplier?.name}
                                                        label={'Nhà cung cấp'}
                                                        variant="standard" />
                                                )}
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                {!selectedProduct ? (
                                                    <Autocomplete
                                                        className='w-full'
                                                        disablePortal
                                                        options={[]}
                                                        readOnly
                                                        renderInput={(params) => <TextField {...params} disabled variant='standard' label="Kho" />}
                                                    />
                                                ) : (
                                                    <TextField
                                                        className='w-full'
                                                        type={'text'}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: selectedProduct !== null,
                                                        }}
                                                        value={selectedWarehouse?.name}
                                                        label={'Kho'}
                                                        variant="standard" />
                                                )}
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <div className='flex justify-center'>
                                                    <PlusCircle onClick={handleAddItemToForm} className='cursor-pointer hover:text-green-500' />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {formData && formData.map((item, index) => (
                                            <TableRow key={index} className={`text-center `}>
                                                <TableCell align='center'>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {item.productName}
                                                </TableCell>
                                                {index === selectedRow ? (
                                                    <TableCell className='p-2'>
                                                        <TextField
                                                            type={'number'}
                                                            inputProps={{ min: 1 }}
                                                            onChange={(e) => handleFieldChange('quantity', Number(e.target.value), index)}
                                                            value={item.quantity}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            label={'Số lượng'}
                                                            variant="standard" />
                                                    </TableCell>
                                                ) : (
                                                    <TableCell align='center'>
                                                        {item.quantity}
                                                    </TableCell>
                                                )}
                                                {index === selectedRow ? (
                                                    <TableCell className='p-2'>
                                                        <Autocomplete
                                                            className='w-full'
                                                            options={
                                                                item?.unitList
                                                                    ? item.unitList.filter(
                                                                        (item: any, index: any, self: any) =>
                                                                            index ===
                                                                            self.findIndex(
                                                                                (t: any) => t.unit === item.unit && t.weightPerUnit === item.weightPerUnit
                                                                            )
                                                                    )
                                                                    : []
                                                            }
                                                            disablePortal
                                                            value={item?.selectedUnit}
                                                            onChange={(event, newValue) => {
                                                                handleFieldChange('unit', newValue.unit, index);
                                                                handleFieldChange('weightPerUnit', newValue.weightPerUnit, index);
                                                                handleFieldChange('selectedUnit', newValue, index);
                                                            }}
                                                            getOptionLabel={(option: any) => `${option.unit} ${option.weightPerUnit}kg`}
                                                            renderInput={(params) => <TextField {...params}
                                                                variant='standard' label="Quy cách" />}
                                                        />
                                                    </TableCell>
                                                ) : (
                                                    <TableCell align='center'>
                                                        {item.unit} {item.weightPerUnit}kg
                                                    </TableCell>
                                                )}
                                                <TableCell align='center'>
                                                    {item.categoryName}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {item.supplierName}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {item.warehouseName}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {index === selectedRow ? (
                                                        <div className='flex justify-center items-center space-x-2'>
                                                            <div className='relative group'>
                                                                <X size={20} className='cursor-pointer hover:text-red-500' onClick={() => setSelectedRow(null)} />
                                                                <span className="absolute w-[70px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Hủy
                                                                </span>
                                                            </div>
                                                            <div className='relative group'>
                                                                <Trash2 size={20} className='cursor-pointer hover:text-red-500' onClick={() => handleDeleteItem(index)} />
                                                                <span className="absolute w-[70px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Xóa
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex justify-center items-center space-x-2'>
                                                            <div className='relative group'>
                                                                <PenSquare size={20} className='cursor-pointer hover:text-blue-500' onClick={() => setSelectedRow(index)} />
                                                                <span className="absolute w-[70px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Sửa
                                                                </span>
                                                            </div>
                                                            <div className='relative group'>
                                                                <Trash2 size={20} className='cursor-pointer hover:text-red-500' onClick={() => handleDeleteItem(index)} />
                                                                <span className="absolute w-[70px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Xóa
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>

                    <div className='w-full flex justify-center align-bottom items-center mt-5 mb-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                            </>
                        ) : (
                            <>
                                <Button onClick={handleSubmit} className='mr-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Thêm</strong>
                                </Button>
                                <Button type='button' onClick={() => router.push("/export")} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Hủy</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
