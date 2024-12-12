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
import { ToastAction } from '@radix-ui/react-toast';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import FloatingButton from '@/components/floating/floatingButton';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ExportPageBreadcrumb from '@/app/(admin)/export/create/breadcrumb';

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
    const { toast } = useToast();
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
    const [onPageChange, setOnPageChange] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore()

    useEffect(() => {
        setBreadcrumb(<ExportPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setProductName(selectedProduct?.name || '');
            setSelectedCategory(selectedProduct?.category || null);
            setSelectedSupplier(selectedProduct?.supplier || null);
            setSelectedWarehouse(selectedProduct?.productWarehouses[0]?.warehouse || null);
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

    const errors: string[] = [];

    const handleAddItemToForm = () => {

        if (!selectedProduct) {
            errors.push('Vui lòng chọn sản phẩm!');
        }

        if (quantity === 0) {
            errors.push('Số lượng không hợp lệ!');
        }

        if (!selectedUnit) {
            errors.push('Vui lòng chọn quy cách!');

        }

        if (errors.length > 0) {
            toast({
                variant: 'destructive',
                title: 'Có lỗi xảy ra!',
                description: (
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                ),
                duration: 3000,
            });
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
        setOnPageChange(true);
        if (formData.length < 1) {
            toast({
                variant: 'destructive',
                title: 'Đã xảy ra lỗi!',
                description: 'Danh sách rỗng! Vui lòng thêm sản phẩm.',
                duration: 3000
            })
            setOnPageChange(false);
            return;
        }

        try {
            const response = await api.post(`/products/export/preview`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Tạo thành công',
                    description: `Lô hàng đã được tạo thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push("/export");
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            setOnPageChange(false);
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    };

    const handleDeleteItem = (index: number) => {
        setFormData(prevFormData => prevFormData.filter((_, i) => i !== index));
    };

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
                        <div className='mt-10 lg:px-10 px-2 lg:flex-row flex-col flex w-full lg:space-x-2 lg:space-y-0 space-y-2'>
                            <div className='flex space-x-2 w-fit bg-[#4ba94d] items-center rounded-lg pr-1'>
                                <p className='text-white font-semibold p-2 rounded-lg'>Tìm kiếm sản phẩm: </p>
                                <Autocomplete
                                    disablePortal
                                    options={
                                        products.filter((product: any) => {
                                            return (
                                                product.productWarehouses &&
                                                product.productWarehouses.some(
                                                    (warehouse: any) =>
                                                        warehouse.unit && warehouse.unit.trim() !== '' && warehouse.weightPerUnit > 0
                                                )
                                            );
                                        })
                                    }

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
                                                    Quy cách
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[10%]`}>
                                                <p className='font-semibold text-white'>
                                                    Số lượng
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className={`w-[15%]`}>
                                                <p className='font-semibold text-white'>
                                                    Kho
                                                </p>
                                            </TableCell>
                                            <TableCell align='center' className="w-[5%]"><p className='font-semibold text-white'>Hành động</p></TableCell>
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
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                {!selectedProduct ? (
                                                    <Autocomplete
                                                        className='w-full'
                                                        options={[]}
                                                        disablePortal
                                                        readOnly
                                                        renderInput={(params) => <TextField {...params}
                                                            disabled variant='standard' />}
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
                                                        renderInput={(params) => <TextField {...params} disabled variant='standard' />}
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
                                                        variant="standard" />
                                                )}
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <Autocomplete
                                                    disableClearable
                                                    className='w-full'
                                                    options={
                                                        selectedProduct?.productWarehouses
                                                            ? selectedProduct.productWarehouses.filter((item: any, index: any, self: any) => {
                                                                const isValid = item.unit !== null && item.weightPerUnit !== 0;
                                                                const isUnique =
                                                                    index ===
                                                                    self.findIndex(
                                                                        (t: any) => t.unit === item.unit && t.weightPerUnit === item.weightPerUnit
                                                                    );
                                                                return isValid && isUnique;
                                                            })
                                                            : []
                                                    }

                                                    disablePortal
                                                    value={selectedUnit}
                                                    onChange={(event, newValue) => {
                                                        setSelectedUnit(newValue)
                                                    }}
                                                    getOptionLabel={(option: any) => `${option.unit} ${option.weightPerUnit}kg`}
                                                    renderInput={(params) => <TextField {...params}
                                                        variant='standard' />}
                                                />
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
                                                            // setQuantityValidate(true)
                                                        }
                                                    }}
                                                    value={quantity || ''}
                                                    // error={isNaN(quantity) || !quantityValidate}
                                                    variant="standard" />
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                {!selectedProduct ? (
                                                    <Autocomplete
                                                        className='w-full'
                                                        disablePortal
                                                        options={[]}
                                                        readOnly
                                                        renderInput={(params) => <TextField {...params} disabled variant='standard' />}
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
                                                <TableCell align='center'>
                                                    {item.categoryName}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {item.supplierName}
                                                </TableCell>
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
                                <Button type='button' onClick={() => {
                                    router.push("/export")
                                    setOnPageChange(true)
                                }} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Hủy</strong>
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
        </div>
    );
};

export default Page;
