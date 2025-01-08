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
import { useToast } from '@/hooks/use-toast';
import FloatingButton from '@/components/floating/floatingButton';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { ToastAction } from '@radix-ui/react-toast';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ImportPageBreadcrumb from '@/app/(admin)/import/create/breadcrumb';

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
    unitOfMeasureId: number;
    warehouseId: number;
    warehouseName: string;
}

const Page = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<RowData[]>([]);
    const [categories, setCategories] = useState<RowData[]>([]);
    const [warehouses, setWarehouses] = useState<RowData[]>([]);
    const [products, setProducts] = useState<RowData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [productName, setProductName] = useState('');
    const [productNameValidate, setProductNameValidate] = useState(true);
    const [importPrice, setImportPrice] = useState(0);
    const [importPriceValidate, setImportPriceValidate] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [quantityValidate, setQuantityValidate] = useState(true);
    const [weight, setWeight] = useState(0);
    const [weightValidate, setWeightValidate] = useState(true);
    const [type, setType] = useState<string | null>(null);
    const [typeValidate, setTypeValidate] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<RowData | null>(null);
    const [categoryValidate, setCategoryValidate] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState<RowData | null>(null);
    const [supplierValidate, setSupplierValidate] = useState(true);
    const [selectedWarehouse, setSelectedWarehouse] = useState<RowData | null>(null);
    const [warehouseValidate, setWarehouseValidate] = useState(true);
    const [formData, setFormData] = useState<FormDataItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [onPageChange, setOnPageChange] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore()

    useEffect(() => {
        setBreadcrumb(<ImportPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);
    useEffect(() => {
        getSuppliers();
        getProducts();
        getCategories();
        getWarehouses();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setImportPrice(selectedProduct?.importPrice);
            setProductName(selectedProduct?.name || '');
            const foundCategory = categories.find((category) => category.id === selectedProduct?.category?.id);
            setSelectedCategory(foundCategory || null);
            const foundSupplier = suppliers.find((supplier) => supplier.id === selectedProduct?.supplier?.id);
            setSelectedSupplier(foundSupplier || null);
        } else {
            setImportPrice(0);
            setProductName('');
            setSelectedSupplier(null);
            setSelectedCategory(null);
        }
    }, [selectedProduct])

    useEffect(() => {
        setSelectedProduct(null);
    }, [selectedWarehouse])

    const getSuppliers = async () => {
        try {
            const url = `/suppliers/all`;
            const response = await api.get(url);
            const data = response.data;
            setSuppliers(data.filter((s: any) => s.active === true));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách nhà cung cấp!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    const getWarehouses = async () => {
        try {
            const url = `/warehouses/all`;
            const response = await api.get(url);
            const data = response.data;
            setWarehouses(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách nhà kho!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    const getProducts = async () => {
        try {
            const url = `/products/`;
            const response = await api.get(url);
            const data = response.data;
            setProducts(data.filter((p: any) => p.isDeleted === false));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách sản phẩm!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    const getCategories = async () => {
        try {
            const url = `/categories/all`;
            const response = await api.get(url);
            const data = response.data;
            setCategories(data.filter((c: any) => c.active === true));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách danh mục!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    const handleAddItemToForm = () => {
        const tempErrors: string[] = [];

        if (productName === '') {
            tempErrors.push('Tên sản phẩm không được bỏ trống!');
            setProductNameValidate(false);
        }

        if (importPrice === 0) {
            tempErrors.push('Giá nhập không hợp lệ!');
            setImportPriceValidate(false);
        }

        if (weight <= 0) {
            tempErrors.push('Trọng lượng không hợp lệ!');
            setWeightValidate(false);
        }

        if (quantity <= 0) {
            tempErrors.push('Số lượng không hợp lệ!');
            setQuantityValidate(false);
        }

        if (!type) {
            tempErrors.push('Vui lòng chọn quy cách!');
            setTypeValidate(false);
        }

        if (!selectedCategory) {
            tempErrors.push('Vui lòng chọn danh mục!');
            setCategoryValidate(false);
        }

        if (!selectedSupplier) {
            tempErrors.push('Vui lòng chọn nhà cung cấp!');
            setSupplierValidate(false);
        }

        if (tempErrors.length > 0) {
            toast({
                variant: 'destructive',
                title: 'Có lỗi xảy ra!',
                description: (
                    <ul>
                        {tempErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                ),
                duration: 3000,
            });
            return;
        }

        setTotalPrice(totalPrice + quantity * importPrice * weight);

        const newItem: FormDataItem = {
            name: productName,
            description: 'description',
            importPrice: importPrice,
            image: "",
            quantity: quantity,
            weightPerUnit: weight,
            unit: type || '',
            categoryName: selectedCategory?.name,
            categoryId: selectedCategory?.id,
            supplierName: selectedSupplier?.name,
            supplierId: selectedSupplier?.id,
            unitOfMeasureId: 1,
            warehouseName: selectedWarehouse?.name,
            warehouseId: selectedWarehouse?.id
        };

        setFormData(prevFormData => [...prevFormData, newItem]);
        setSelectedProduct(null);
        setSelectedCategory(null);
        setSelectedSupplier(null);
        setType(null);
        setProductName('');
        setImportPrice(0);
        setQuantity(0);
        setWeight(0);
        setType('');
    };

    useEffect(() => {
        if (selectedWarehouse) {
            setFormData(prevFormData =>
                prevFormData.map(item => ({
                    ...item,
                    warehouseName: selectedWarehouse.name,
                    warehouseId: selectedWarehouse.id
                }))
            );
        }
    }, [selectedWarehouse]);

    const handleFieldChange = (fieldName: any, fieldValue: any, index: any) => {
        setFormData(prevFormData =>
            prevFormData.map((item, i) =>
                i === index
                    ? { ...item, [fieldName]: fieldValue }
                    : item
            )
        );
    };

    useEffect(() => {
        const total = formData.reduce((sum, item) => {
            const quantity = item.quantity || 0;
            const importPrice = item.importPrice || 0;
            const weight = item.weightPerUnit || 0;
            return sum + (quantity * weight) * importPrice;
        }, 0);
        setTotalPrice(total);
    }, [formData]);

    const handleSubmit = async () => {
        setOnPageChange(true);
        if (formData.length < 1) {
            toast({
                variant: 'destructive',
                title: 'Không thể tạo phiếu!',
                description: 'Danh sách rỗng! Vui lòng thêm sản phẩm.',
                duration: 3000
            })
            setOnPageChange(false);
            return;
        }

        if (!selectedWarehouse) {
            setWarehouseValidate(false);
            toast({
                variant: 'destructive',
                title: 'Không thể tạo phiếu!',
                description: 'Vui lòng chọn kho hàng',
                duration: 3000,
            });
            setOnPageChange(false);
            return;
        }

        try {
            const response = await api.post(`/products/import/preview`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Tạo phiếu thành công',
                    description: `Lô hàng đã được tạo thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push("/import");
            } else {
                setOnPageChange(false);
                toast({
                    variant: 'destructive',
                    title: 'Tạo thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
            }
        } catch (error: any) {
            setOnPageChange(false);
            const messages = error?.response?.data?.message || ['Đã xảy ra lỗi, vui lòng thử lại.'];
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: (
                    <div>
                        {Array.isArray(messages) ? (
                            messages.map((msg: any, index: any) => (
                                <div key={index}>{msg}</div>
                            ))
                        ) : (
                            <div>{messages}</div>
                        )}
                    </div>
                ),
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            });
        }
    };

    const handleDeleteItem = (index: number) => {
        setFormData(prevFormData => prevFormData.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className='w-full flex my-10 justify-center'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    {loadingData ? (
                        <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                    ) : (
                        <div
                            className={`w-[100%] mt-5 text-center lg:mt-10 p-[7px] text-white bg-[#4ba94d]`}
                            style={{ boxShadow: '3px 3px 5px lightgray' }}
                        >
                            <strong>Thông tin phiếu nhập</strong>
                        </div>
                    )}
                    {loadingData ? (
                        <div className='mt-10 lg:px-10 px-2 flex lg:w-[50%] w-full'>
                            <div className="flex flex-col lg:flex-row items-center w-full">
                                <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-[400px] w-[100%] rounded-lg' />
                                <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-[400px] w-[100%] lg:ml-2 rounded-lg' />
                            </div>
                        </div>
                    ) : (
                        <div className='mt-10 lg:px-10 px-2 lg:flex-row flex-col flex w-full lg:space-x-2 lg:space-y-0 space-y-2'>
                            <div className='flex space-x-2 w-fit bg-[#4ba94d] items-center rounded-lg pr-1'>
                                <p className='text-white font-semibold p-2 rounded-lg'>Chọn nhà kho: </p>
                                <Autocomplete
                                    disablePortal
                                    options={warehouses}
                                    value={selectedWarehouse}
                                    sx={{
                                        width: 300,
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "white",
                                            borderRadius: "8px",
                                            paddingRight: "8px",
                                        },
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, newValue) => {
                                        setSelectedWarehouse(newValue)
                                        setWarehouseValidate(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            error={!warehouseValidate}
                                            {...params}
                                            variant='standard'
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    paddingX: "10px",
                                                },
                                                "& .MuiInput-underline:before": {
                                                    display: "none",
                                                },
                                                "& .MuiInput-underline:after": {
                                                    display: "none",
                                                },
                                            }}
                                        />}
                                />
                            </div>
                            {selectedWarehouse && (
                                console.log(products),
                                <div className='flex space-x-2 w-fit bg-[#4ba94d] items-center rounded-lg pr-1'>
                                    <p className='text-white font-semibold p-2 rounded-lg'>Tìm kiếm sản phẩm: </p>
                                    <Autocomplete
                                        disablePortal
                                        options={products.filter((p: RowData) => p.productWarehouses.length > 0 && p.productWarehouses[0].warehouse.id === selectedWarehouse.id)}
                                        getOptionLabel={(option) =>
                                            option.category.name + " - " + option.name + " (" + option.supplier.name + ")"
                                        }
                                        sx={{
                                            width: 300,
                                            "& .MuiInputBase-root": {
                                                backgroundColor: "white",
                                                borderRadius: "8px",
                                                paddingRight: "8px",
                                            },
                                        }}
                                        value={selectedProduct}
                                        onChange={(event, newValue) => setSelectedProduct(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                sx={{
                                                    "& .MuiInputBase-root": {
                                                        paddingX: "10px",
                                                    },
                                                    "& .MuiInput-underline:before": {
                                                        display: "none",
                                                    },
                                                    "& .MuiInput-underline:after": {
                                                        display: "none",
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className='lg:px-10 mt-5 px-2 w-full'>
                        {loadingData ? (
                            <div className="w-full">
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-t-lg' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-2' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-b-lg mt-2' />
                            </div>
                        ) : (
                            <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 1000, borderCollapse: 'collapse' }} aria-label="simple table">
                                    <TableHead className='bg-[#0090d9]'>
                                        <TableRow>
                                            <TableCell rowSpan={2} className={`w-[5%]`}>
                                                <p className='font-semibold text-white'>STT</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>Tên sản phẩm</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className={`w-[15%]`}>
                                                <p className='font-semibold text-white'>Danh mục</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className={`w-[15%]`}>
                                                <p className='font-semibold text-white'>Nhà cung cấp</p>
                                            </TableCell>
                                            <TableCell align='center' colSpan={2} className={`w-[20%]`}>
                                                <p className='font-semibold text-white'>Quy cách</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>Giá nhập (kg)</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>Số lượng</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>Tổng cộng</p>
                                            </TableCell>
                                            <TableCell rowSpan={2} className="w-[10%]"><p className='font-semibold text-white'>Hành động</p></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='center' className={`w-[10%] `}>
                                                <p className='font-semibold text-white'>Loại</p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>Trọng lượng</p>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} className='px-2 py-4'>
                                                <TextField
                                                    type={'text'}
                                                    className='w-full'
                                                    onChange={(e) => {
                                                        setProductName(e.target.value)
                                                        setProductNameValidate(true)
                                                    }}
                                                    value={productName}
                                                    error={!productNameValidate}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <Autocomplete
                                                    disablePortal
                                                    options={categories}
                                                    value={selectedCategory}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(event, newValue) => {
                                                        setSelectedCategory(newValue)
                                                        setCategoryValidate(true)
                                                    }}
                                                    renderInput={(params) => <TextField {...params} error={!categoryValidate} variant='standard' />}
                                                />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <Autocomplete
                                                    disablePortal
                                                    options={suppliers}
                                                    value={selectedSupplier}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(event, newValue) => {
                                                        setSelectedSupplier(newValue)
                                                        setSupplierValidate(true)
                                                    }}
                                                    renderInput={(params) => <TextField error={!supplierValidate} {...params} variant='standard' />}
                                                />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <Autocomplete
                                                    disablePortal
                                                    value={type ? type : ''}
                                                    options={['Bao', 'Túi']}
                                                    onChange={(event, newValue) => {
                                                        setType(newValue)
                                                        setTypeValidate(true)
                                                    }}
                                                    renderInput={(params) => <TextField error={!typeValidate} {...params} variant='standard' />}
                                                />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <TextField
                                                    type={'text'}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const numericValue = Number(value);
                                                        if (!isNaN(numericValue) && Number(value) >= 0) {
                                                            setWeight(Number(value));
                                                            setWeightValidate(true)
                                                        }
                                                    }}
                                                    value={weight || ''}
                                                    error={isNaN(weight) || !weightValidate}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <TextField
                                                    type={'text'}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const numericValue = Number(value);
                                                        if (!isNaN(numericValue) && Number(value) >= 0) {
                                                            setImportPrice(Number(value));
                                                            setImportPriceValidate(true)
                                                        }
                                                    }}
                                                    value={importPrice || ''}
                                                    error={isNaN(importPrice) || !importPriceValidate}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <TextField
                                                    type={'text'}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const numericValue = Number(value);
                                                        if (!isNaN(numericValue) && Number(value) >= 0) {
                                                            setQuantity(Number(value))
                                                            setQuantityValidate(true)
                                                        }
                                                    }}
                                                    value={quantity || ''}
                                                    error={isNaN(quantity) || !quantityValidate}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(quantity * importPrice * weight || 0))}</TableCell>
                                            <TableCell align='center' className='p-2'>
                                                <div className='flex justify-center'>
                                                    <PlusCircle onClick={handleAddItemToForm} className='cursor-pointer hover:text-green-500' />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {formData && formData.map((item, index) => (
                                            index === selectedRow ? (
                                                <TableRow key={index} className={`text-center `}>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <Autocomplete
                                                            disablePortal
                                                            disableClearable
                                                            options={categories}
                                                            getOptionLabel={(option) => option.name}
                                                            value={categories.find((category) => category.name === item.categoryName)}
                                                            onChange={(event, newValue) => {
                                                                handleFieldChange('categoryId', newValue.name, index)
                                                                handleFieldChange('categoryName', newValue.name, index)
                                                            }}
                                                            renderInput={(params) => <TextField {...params} variant='standard' />}
                                                        />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <Autocomplete
                                                            disableClearable
                                                            disablePortal
                                                            options={suppliers}
                                                            getOptionLabel={(option) => option.name}
                                                            value={suppliers.find((supplier) => supplier.name === item.supplierName)}
                                                            onChange={(event, newValue) => {
                                                                handleFieldChange('supplierId', newValue.name, index)
                                                                handleFieldChange('supplierName', newValue.name, index)
                                                            }}
                                                            renderInput={(params) => <TextField {...params} variant='standard' />}
                                                        />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <Autocomplete
                                                            disablePortal
                                                            options={['Bao', 'Túi']}
                                                            value={item.unit}
                                                            disableClearable
                                                            onChange={(event, newValue) => {
                                                                handleFieldChange('unit', newValue, index)
                                                                setType(newValue)
                                                                setTypeValidate(true)
                                                            }}
                                                            renderInput={(params) => <TextField error={!typeValidate} {...params} variant='standard' />}
                                                        />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <TextField
                                                            type={'number'}
                                                            onChange={(e) => handleFieldChange('weightPerUnit', e.target.value, index)}
                                                            value={item.weightPerUnit}
                                                            variant="standard" />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <TextField
                                                            type={'text'}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const numericValue = Number(value);
                                                                if (!isNaN(numericValue) && Number(value) >= 0) {
                                                                    handleFieldChange('importPrice', Number(e.target.value), index)
                                                                    setImportPriceValidate(true)
                                                                }
                                                            }}
                                                            error={isNaN(item.importPrice) || item.importPrice <= 0}
                                                            value={item.importPrice}
                                                            variant="standard" />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <TextField
                                                            type={'text'}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const numericValue = Number(value);
                                                                if (!isNaN(numericValue) && Number(value) >= 0) {
                                                                    handleFieldChange('quantity', Number(e.target.value), index)
                                                                    setQuantityValidate(true)
                                                                }
                                                            }}
                                                            value={item.quantity}
                                                            variant="standard" />
                                                    </TableCell>
                                                    <TableCell>
                                                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.quantity * item.importPrice * item.weightPerUnit || 0))}
                                                    </TableCell>
                                                    <TableCell align='center'>
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
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                <TableRow key={index} className={`text-center `}>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.categoryName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.supplierName}
                                                    </TableCell>
                                                    <TableCell colSpan={2} align='center'>
                                                        {item.unit} {item.weightPerUnit}kg
                                                    </TableCell>
                                                    <TableCell>
                                                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.importPrice))}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.quantity * item.importPrice * item.weightPerUnit || 0))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex justify-center items-center space-x-2'>
                                                            <div className='relative group'>
                                                                <PenSquare size={20} className='cursor-pointer hover:text-blue-500' onClick={() => setSelectedRow(index)} />
                                                                <span className="absolute w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Sửa
                                                                </span>
                                                            </div>
                                                            <div className='relative group'>
                                                                <Trash2 size={20} className='cursor-pointer hover:text-red-500' onClick={() => handleDeleteItem(index)} />
                                                                <span className="absolute w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Xóa
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={7}></TableCell>
                                            <TableCell colSpan={3} align="center" className='font-bold space-x-2 text-[20px]'>
                                                <span>
                                                    Tổng tiền:
                                                </span>
                                                <span>
                                                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(totalPrice))}
                                                </span>
                                            </TableCell>
                                        </TableRow>
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
                                <Button type='button' onClick={() => {
                                    router.push("/import")
                                    setOnPageChange(true);
                                }} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Hủy</strong>
                                </Button>

                            </>
                        )}
                    </div>
                </div >
            </div >
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
