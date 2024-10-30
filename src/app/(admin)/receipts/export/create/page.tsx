/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "../../../../../api/axiosConfig";
import { Autocomplete, TextField } from '@mui/material';
import { PlusCircle, Trash2 } from 'lucide-react';

interface RowData {
    [key: string]: any;
}

interface FormDataItem {
    productName: string;
    unit: string;
    weightPerUnit: number;
    quantity: number;
    categoryName: string;
    categoryId: string;
    supplierId: number;
    supplierName: string;
    warehouseId: number;
    warehouseName: string;
}

const Page = () => {
    const router = useRouter();
    const [products, setProducts] = useState<RowData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<RowData | null>(null);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [weight, setWeight] = useState(0);
    const [selectedType, setSelectedType] = useState<RowData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<RowData | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<RowData | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<RowData | null>(null);
    const [formData, setFormData] = useState<FormDataItem[]>([]);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (selectedType) {
            setWeight(selectedType?.weightPerUnit);
        } else {
            setWeight(0);
        }
    }, [selectedType])

    useEffect(() => {
        console.log(selectedProduct);
        if (selectedProduct) {
            setProductName(selectedProduct?.name || '');
            // setWeight(selectedProduct?.batchProducts[0]?.weightPerUnit)
            setSelectedCategory(selectedProduct?.category || null);
            setSelectedSupplier(selectedProduct?.supplier || null);
            setSelectedWarehouse(selectedProduct?.productWarehouses[0]?.warehouse || null);
        } else {
            setProductName('');
            setSelectedProduct(null);
            setSelectedSupplier(null);
            setSelectedCategory(null);
            setSelectedWarehouse(null);
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
        }
    };

    const handleAddItemToForm = () => {
        if (productName === '') {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }

        if (weight === 0) {
            alert('Trọng lượng không hợp lệ');
            return;
        }

        if (quantity === 0) {
            alert('Số lượng không hợp lệ');
            return;
        }

        if (!selectedType) {
            alert('Vui lòng chọn quy cách');
            return;
        }

        if (!selectedCategory) {
            alert('Vui lòng chọn danh mục');
            return;
        }

        if (!selectedCategory) {
            alert('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (!selectedCategory) {
            alert('Vui lòng chọn kho');
            return;
        }
        const newItem: FormDataItem = {
            productName: productName,
            quantity: quantity,
            weightPerUnit: weight,
            unit: selectedType?.unit,
            categoryName: selectedCategory?.name,
            categoryId: selectedCategory?.id,
            supplierName: selectedSupplier?.name,
            supplierId: selectedSupplier?.id,
            warehouseName: selectedWarehouse?.name,
            warehouseId: selectedWarehouse?.id
        };
        setFormData(prevFormData => [...prevFormData, newItem]);
        setSelectedProduct(null);
        setSelectedCategory(null);
        setSelectedSupplier(null);
        setSelectedWarehouse(null);
        setProductName('');
        setQuantity(0);
        setWeight(0);
        setSelectedType(null);
    }

    const handleSubmit = async () => {

        if (formData.length < 1) {
            alert("Danh sách rỗng! Vui lòng thêm sản phẩm.");
            return;
        }

        try {
            const response = await api.post(`/products/export`, formData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Lô hàng đã được xuất thành công`);
                router.push("/receipts");
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

    return (
        <div>
            <div className='flex my-16 justify-center w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div
                        className={`w-[100%] mt-5 text-center lg:mt-10 p-[7px] text-white bg-black hover:bg-[#1d1d1fca]}`}
                        style={{ boxShadow: '3px 3px 5px lightgray' }}
                    >
                        <strong>Thông tin phiếu xuất</strong>
                    </div>
                    <div className='mt-10 lg:px-10 px-2 flex lg:w-[50%] w-full'>
                        <div className='m-5 flex-1 flex flex-col lg:flex-row lg:items-center'>
                            <span className='font-bold flex-[2] pt-4'>Chọn sản phẩm: </span>
                            <Autocomplete
                                className='flex-[4] lg:mx-5 my-4 lg:my-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                disablePortal
                                options={products}
                                value={selectedProduct}
                                getOptionLabel={(option) => option.name}
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => { setSelectedProduct(newValue) }}
                                renderInput={(params) => <TextField {...params} variant='standard' label="Tìm kiếm sản phẩm" />}
                            />
                        </div>
                    </div>
                    <div className='lg:px-10 mt-5 px-2 overflow-x-auto'>
                        <table className="w-full bg-white border-collapse mb-10 overflow-hidden rounded-2xl">
                            <thead className='rounded-2xl'>
                                <tr className="bg-white border-2 border-gray-200">
                                    <th className={`min-w-[50px] pt-3 bg-white text-black px-2 py-2 rounded-tl-2xl`}>
                                        STT
                                    </th>
                                    <th className={`min-w-[150px] pt-3 bg-white text-black px-2 py-2`}>
                                        Tên sản phẩm
                                    </th>
                                    <th className={`min-w-[100px] pt-3 bg-white text-black px-2 py-2`}>
                                        Trọng lượng
                                    </th>
                                    <th className={`min-w-[100px] pt-3 bg-white text-black px-2 py-2`}>
                                        Số lượng
                                    </th>
                                    <th className={`min-w-[120px] pt-3 bg-white text-black px-2 py-2`}>
                                        Quy cách
                                    </th>
                                    <th className={`min-w-[150px] pt-3 bg-white text-black px-2 py-2`}>
                                        Danh mục
                                    </th>
                                    <th className={`min-w-[150px] pt-3 bg-white text-black px-2 py-2`}>
                                        Nhà cung cấp
                                    </th>
                                    <th className={`min-w-[150px] pt-3 bg-white text-black px-2 py-2`}>
                                        Kho
                                    </th>
                                    <th className="min-w-[50px] bg-white text-black px-2 py-2 rounded-tr-2xl">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={`font-semibold border-2 border-gray-200 bg-white`}>
                                    <td colSpan={2} className='p-2'>
                                        <TextField
                                            type={'text'}
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
                                    </td>
                                    <td className='p-2'>
                                        <TextField
                                            type={'number'}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{ min: 0 }}
                                            value={weight}
                                            label={'Trọng lượng'}
                                            variant="standard" />
                                    </td>
                                    <td className='p-2'>
                                        <TextField
                                            inputProps={{ min: 0 }}
                                            type={'number'}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            value={quantity}
                                            label={'Số lượng'}
                                            variant="standard" />
                                    </td>
                                    <td className='p-2'>
                                        <Autocomplete
                                            disablePortal
                                            options={selectedProduct?.batchProducts || []}
                                            getOptionLabel={(option: any) => option?.unit}
                                            onChange={(event, newValue) => setSelectedType(newValue)}
                                            renderInput={(params) => <TextField {...params} variant='standard' label="Quy cách" />}
                                        />
                                    </td>
                                    <td className='p-2'>
                                        {!selectedProduct ? (
                                            <Autocomplete
                                                options={[]}
                                                disablePortal
                                                readOnly
                                                renderInput={(params) => <TextField {...params} disabled variant='standard' label="Danh mục" />}
                                            />
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                InputLabelProps={{
                                                    shrink: selectedProduct !== null,
                                                }}
                                                value={selectedCategory?.name}
                                                label={'Danh mục'}
                                                variant="standard" />
                                        )}
                                    </td>
                                    <td className='p-2'>
                                        {!selectedProduct ? (
                                            <Autocomplete
                                                options={[]}
                                                disablePortal
                                                readOnly
                                                renderInput={(params) => <TextField {...params} disabled variant='standard' label="Nhà cung cấp" />}
                                            />
                                        ) : (
                                            <TextField
                                                type={'text'}
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
                                    </td>
                                    <td className='p-2'>
                                        {!selectedProduct ? (
                                            <Autocomplete
                                                disablePortal
                                                options={[]}
                                                readOnly
                                                renderInput={(params) => <TextField {...params} disabled variant='standard' label="Kho" />}
                                            />
                                        ) : (
                                            <TextField
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
                                    </td>
                                    <td className='p-2'>
                                        <PlusCircle onClick={handleAddItemToForm} className='cursor-pointer hover:text-green-500' />
                                    </td>
                                </tr>
                                {formData && formData.map((item, index) => (
                                    <tr key={index} className={`text-center border-2 border-gray-200 bg-white`}>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {index + 1}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.productName}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.weightPerUnit}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.quantity}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.unit}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.categoryName}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.supplierName}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            {item.warehouseName}
                                        </td>
                                        <td className='p-2 border-2 border-gray-200'>
                                            <Trash2 color='red' className='cursor-pointer' onClick={() => handleDeleteItem(index)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='lg:px-10 px-2 flex'>
                        <div className='m-5 flex-1 flex flex-col lg:flex-row lg:items-center'>

                        </div>
                        <div className='flex-1'></div>
                    </div>

                    <div className='w-full flex justify-center align-bottom items-center mt-5 mb-10'>
                        <Button onClick={handleSubmit} className='mr-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Thêm</strong>
                        </Button>
                        <Button type='button' onClick={() => router.push("/receipts")} className='ml-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Hủy</strong>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
