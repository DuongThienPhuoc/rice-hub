/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "../../../../api/axiosConfig";
import { Autocomplete, Skeleton, TextField } from '@mui/material';
import { PlusCircle, Trash2 } from 'lucide-react';

interface RowData {
    [key: string]: any;
}

interface FormDataItem {
    name: string;
    description: string;
    importPrice: number;
    image: string;
    quantity: number;
    weightPerUnit: number;
    unit: string;
    categoryName: string;
    categoryId: string;
    supplierId: number;
    supplierName: string;
    unitOfMeasureName: string;
    unitOfMeasureId: number;
    warehouseId: number;
    warehouseName: string;
}

const Page = () => {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<RowData[]>([]);
    const [categories, setCategories] = useState<RowData[]>([]);
    const [warehouses, setWarehouses] = useState<RowData[]>([]);
    const [units, setUnits] = useState<RowData[]>([]);
    const [products, setProducts] = useState<RowData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<RowData | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [productName, setProductName] = useState('');
    const [importPrice, setImportPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [selectedUnit, setSelectedUnit] = useState<RowData | null>(null);
    const [weight, setWeight] = useState(0);
    const [type, setType] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<RowData | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<RowData | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<RowData | null>(null);
    const [formData, setFormData] = useState<FormDataItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        getSuppliers();
        getProducts();
        getCategories();
        getWarehouses();
        getUnits();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setImportPrice(selectedProduct?.importPrice);
            setProductName(selectedProduct?.name || '');
            const foundCategory = categories.find((category) => category.id === selectedProduct?.category?.id);
            setSelectedCategory(foundCategory || null);
            const foundSupplier = suppliers.find((supplier) => supplier.id === selectedProduct?.supplier?.id);
            setSelectedSupplier(foundSupplier || null);
            const foundWarehouse = warehouses.find((warehouse) => warehouse.id === selectedProduct?.productWarehouses[0]?.warehouse.id);
            setSelectedWarehouse(foundWarehouse || null);
        } else {
            setImportPrice(0);
            setProductName('');
            setSelectedSupplier(null);
            setSelectedProduct(null);
            setSelectedCategory(null);
            setSelectedWarehouse(null);
        }
    }, [selectedProduct])

    const getSuppliers = async () => {
        try {
            const url = `/suppliers/all`;
            const response = await api.get(url);
            const data = response.data;
            setSuppliers(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
        }
    };

    const getWarehouses = async () => {
        try {
            const url = `/warehouses/All`;
            const response = await api.get(url);
            const data = response.data;
            setWarehouses(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà nhà kho:", error);
        }
    };

    const getProducts = async () => {
        setLoadingData(true);
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

    const getCategories = async () => {
        try {
            const url = `/categories/all`;
            const response = await api.get(url);
            const data = response.data;
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error);
        }
    };

    const getUnits = async () => {
        try {
            const url = `/unitOfMeasures/All`;
            const response = await api.get(url);
            const data = response.data;
            setUnits(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn vị:", error);
        }
    };

    const handleAddItemToForm = () => {
        if (productName === '') {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }

        if (importPrice === 0) {
            alert('Giá nhập không hợp lệ');
            return;
        }

        if (!selectedUnit) {
            alert('Vui lòng chọn đơn vị');
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

        if (!type) {
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
            name: productName,
            description: '',
            importPrice: importPrice,
            image: "",
            quantity: quantity,
            weightPerUnit: weight,
            unit: type || '',
            categoryName: selectedCategory?.name,
            categoryId: selectedCategory?.id,
            supplierName: selectedSupplier?.name,
            supplierId: selectedSupplier?.id,
            unitOfMeasureName: selectedUnit?.unitName,
            unitOfMeasureId: selectedUnit?.id,
            warehouseName: selectedWarehouse?.name,
            warehouseId: selectedWarehouse?.id
        };
        setFormData(prevFormData => [...prevFormData, newItem]);
        setSelectedProduct(null);
        setSelectedUnit(null);
        setSelectedCategory(null);
        setSelectedSupplier(null);
        setSelectedWarehouse(null);
        setProductName('');
        setImportPrice(0);
        setQuantity(0);
        setWeight(0);
        setType(null);
    }

    const handleSubmit = async () => {

        if (formData.length < 1) {
            alert("Danh sách rỗng! Vui lòng thêm sản phẩm.");
            return;
        }

        try {
            console.log(formData);
            const response = await api.post(`/products/import`, formData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Lô hàng đã được thêm thành công`);
                router.push("/import");
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

    return (
        <div>
            <div className='w-full flex my-10 justify-center font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    {loadingData ? (
                        <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                    ) : (
                        <div
                            className={`w-[100%] mt-5 text-center lg:mt-10 p-[7px] text-white bg-black hover:bg-[#1d1d1fca]}`}
                            style={{ boxShadow: '3px 3px 5px lightgray' }}
                        >
                            <strong>Thông tin phiếu nhập</strong>
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
                            <div className='m-5 flex flex-col lg:flex-row lg:items-center'>
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
                    )}
                    <div className='lg:px-10 mt-5 px-2 overflow-x-auto w-full'>
                        {loadingData ? (
                            <div className="w-full">
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-t-lg' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-2' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-b-lg mt-2' />
                            </div>
                        ) : (
                            <table className="table-auto border-collapse mb-10 overflow-hidden rounded-2xl">
                                <thead className='rounded-2xl'>
                                    <tr className="border-2 border-gray-200">
                                        <th className={`w-[5%] text-black p-2 rounded-tl-2xl`}>
                                            STT
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Tên sản phẩm
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Giá nhập
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Đơn vị
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Trọng lượng
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Số lượng
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Quy cách
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Danh mục
                                        </th>
                                        <th className={`w-[15%] text-black p-2`}>
                                            Nhà cung cấp
                                        </th>
                                        <th className={`w-[10%] text-black p-2`}>
                                            Kho
                                        </th>
                                        <th className="w-[5%] text-black p-2 rounded-tr-2xl">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={`font-semibold border-2 border-gray-200 bg-white`}>
                                        <td colSpan={2} className='px-2 py-4'>
                                            <TextField
                                                type={'text'}
                                                InputProps={{
                                                    readOnly: selectedProduct !== null,
                                                }}
                                                InputLabelProps={{
                                                    shrink: selectedProduct !== null || productName !== '' || isFocused,
                                                }}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                onChange={(e) => setProductName(e.target.value)}
                                                value={productName}
                                                label={'Tên sản phẩm'}
                                                variant="standard" />
                                        </td>
                                        <td className='p-2'>
                                            <TextField
                                                type={'number'}
                                                inputProps={{ min: 0 }}
                                                onChange={(e) => setImportPrice(Number(e.target.value))}
                                                value={importPrice}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label={'Giá nhập'}
                                                variant="standard" />
                                        </td>
                                        <td className='p-2'>
                                            <Autocomplete
                                                disablePortal
                                                options={units}
                                                getOptionLabel={(option) => option.unitName}
                                                onChange={(event, newValue) => setSelectedUnit(newValue)}
                                                renderInput={(params) => <TextField {...params} variant='standard' label="Đơn vị" />}
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <TextField
                                                type={'number'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{ min: 0 }}
                                                onChange={(e) => setWeight(Number(e.target.value))}
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
                                                options={['Bao 10kg', 'Bao 20kg', '...']}
                                                onChange={(event, newValue) => setType(newValue)}
                                                renderInput={(params) => <TextField {...params} variant='standard' label="Quy cách" />}
                                            />
                                        </td>
                                        <td className='p-2'>
                                            {selectedProduct ? (
                                                <TextField
                                                    type={'text'}
                                                    InputProps={{
                                                        readOnly: selectedProduct !== null,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={selectedCategory?.name}
                                                    label={'Danh mục'}
                                                    variant="standard" />
                                            ) : (
                                                <Autocomplete
                                                    disablePortal
                                                    options={categories}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(event, newValue) => setSelectedCategory(newValue)}
                                                    renderInput={(params) => <TextField {...params} variant='standard' label="Danh mục" />}
                                                />
                                            )}
                                        </td>
                                        <td className='p-2'>
                                            {selectedProduct ? (
                                                <TextField
                                                    type={'text'}
                                                    InputProps={{
                                                        readOnly: selectedProduct !== null,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={selectedSupplier?.name}
                                                    label={'Nhà cung cấp'}
                                                    variant="standard" />
                                            ) : (
                                                <Autocomplete
                                                    disablePortal
                                                    options={suppliers}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(event, newValue) => setSelectedSupplier(newValue)}
                                                    renderInput={(params) => <TextField {...params} variant='standard' label="Nhà cung cấp" />}
                                                />
                                            )}
                                        </td>
                                        <td className='p-2'>
                                            {selectedProduct ? (
                                                <TextField
                                                    type={'text'}
                                                    InputProps={{
                                                        readOnly: selectedProduct !== null,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={selectedWarehouse?.name}
                                                    label={'Kho'}
                                                    variant="standard" />
                                            ) : (
                                                <Autocomplete
                                                    disablePortal
                                                    options={warehouses}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(event, newValue) => setSelectedWarehouse(newValue)}
                                                    renderInput={(params) => <TextField {...params} variant='standard' label="Kho" />}
                                                />
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
                                                {item.name}
                                            </td>
                                            <td className='p-2 border-2 border-gray-200'>
                                                {item.importPrice}
                                            </td>
                                            <td className='p-2 border-2 border-gray-200'>
                                                {item.unitOfMeasureName}
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
                                <Button onClick={handleSubmit} className='mr-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Thêm</strong>
                                </Button>
                                <Button type='button' onClick={() => router.push("/receipts")} className='ml-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Hủy</strong>
                                </Button>

                            </>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
};

export default Page;
