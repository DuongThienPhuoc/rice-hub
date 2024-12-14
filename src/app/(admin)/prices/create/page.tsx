/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import api from "@/config/axiosConfig";
import { Trash2, X } from 'lucide-react';
import { Autocomplete, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Skeleton, TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Swal from 'sweetalert2';
import FloatingButton from '@/components/floating/floatingButton';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import CreatePricePageBreadcrumb from '@/app/(admin)/prices/create/breadcrumb';

interface RowData {
    [key: string]: any;
}

const Page = () => {
    const { toast } = useToast();
    const [prices, setPrices] = useState<RowData[]>([]);
    const [customers, setCustomers] = useState<RowData[]>([]);
    const [priceName, setPriceName] = useState('');
    const [newPriceName, setNewPriceName] = useState('');
    const [priceCustomer, setPriceCustomer] = useState<RowData | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<RowData | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [showInput, setShowInput] = useState(false);
    const [onPageChange, setOnPageChange] = useState(false);
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
            },
        },
    };

    const [customerName, setCustomerName] = React.useState<string[]>([]);
    const [ids, setIds] = React.useState<string[]>([]);
    const { setBreadcrumb } = useBreadcrumbStore();

    const handleChange = (event: SelectChangeEvent<typeof customerName>) => {
        const {
            target: { value },
        } = event;

        const newCustomerNames = typeof value === 'string' ? value.split(',') : value;
        setCustomerName(newCustomerNames);

        const selectedIds = customers
            .filter(customer => newCustomerNames.includes(customer.fullName))
            .map(customer => customer.id);

        setIds(selectedIds);
    };

    const getPrices = async () => {
        try {
            const url = `/price/all`;
            const response = await api.get(url);
            const data = response.data;
            setPrices(data);
            if (!priceCustomer) {
                setSelectedPrice(data.find((price: any) => price.id === 1) || null);
                setPriceCustomer(data.find((price: any) => price.id === 1)?.customers)
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi danh sách bảng giá!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        setSelectedPrice(prices.find(price => price.id === selectedPrice?.id) || null);
        setPriceCustomer(selectedPrice?.customers)
    }, [selectedPrice, prices])

    useEffect(() => {
        getCustomers();
        getPrices();
        setBreadcrumb(<CreatePricePageBreadcrumb />);
        return () => setBreadcrumb(null);
    }, []);

    const getCustomers = async () => {
        try {
            const url = `/customer/all`;
            const response = await api.get(url);
            const data = response.data;
            setCustomers(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi danh sách khách hàng!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    const handlePriceNameChange = (e: string) => {
        setPriceName(e);
    }

    const handleCreatePrice = async () => {
        setOnPageChange(true);
        if (priceName === '' || priceName.trim().length < 1) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại!',
                description: 'Xin vui lòng nhập tên bảng giá',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            return;
            setOnPageChange(false);
        }

        const formData = ({
            customerIds: [
                0
            ],
            name: priceName
        })

        try {
            const response = await api.post(`/price/admin/AddPrice`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Tạo thành công',
                    description: `Bảng giá đã được tạo thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                setOnPageChange(false);
                setPriceName('');
                getPrices();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Tạo thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
                setOnPageChange(false);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            setOnPageChange(false);
        }
    }

    const handleUpdatePrice = async () => {
        if (newPriceName === '' || newPriceName.trim().length < 1) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại!',
                description: 'Xin vui lòng nhập tên bảng giá',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            return;
        }

        const formData = ({
            customerIds: [
                0
            ],
            name: newPriceName,
            priceId: selectedPrice?.id
        })

        try {
            const response = await api.post(`/price/admin/UpdatePrice`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Cập nhật thành công',
                    description: `Bảng giá đã được cập nhật thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                setNewPriceName('');
                getPrices();
                setShowInput(false);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Cập nhật thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Cập nhật thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const handleDeletePrice = async () => {
        if (!selectedPrice) {
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại!',
                description: 'Vui lòng chọn bảng giá',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            return;
        }

        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa bảng giá này không, một khi đã xóa thì sẽ đặt lại tất cả khách hàng về giá chung.`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.delete(`/price/admin/DeletePrice/${selectedPrice.id}`);
                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: 'Xóa thành công',
                            description: `Bảng giá đã được xóa thành công`,
                            duration: 3000,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                        })
                        getPrices();
                        setSelectedPrice(prices[0]);
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Xóa thất bại!',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            duration: 3000,
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Xóa thất bại',
                        duration: 3000,
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    })
                }
            }
        })
    }

    const handleApplyPrice = async () => {
        if (!selectedPrice) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại!',
                description: 'Vui lòng chọn bảng giá',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            return;
        }


        if (!ids || ids.length < 1) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại!',
                description: 'Vui lòng chọn khách hàng',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            return;
        }

        const formData = ({
            customerIds: ids,
            priceId: selectedPrice.id,
        })

        try {
            const response = await api.post(`/price/admin/UpdateCustomerPrice`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Áp dụng thành công',
                    description: `Bảng giá đã được áp dụng thành công`,
                    duration: 3000,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                })
                setCustomerName([]);
                setIds([]);
                getPrices();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Áp dụng thất bại!',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    duration: 3000,
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Áp dụng thất bại',
                duration: 3000,
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
        }
    }

    return (
        <div>
            <div className='flex my-10 justify-center w-full'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        <div className={`flex-1`}>
                            {loadingData ? (
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                            ) : (
                                <div
                                    className={`w-[100%] mt-5 lg:mt-10 p-[7px] text-center text-white bg-[#4ba94d]`}
                                    style={{ boxShadow: '3px 3px 5px lightgray' }}
                                >
                                    <strong>Thông tin bảng giá</strong>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col xl:flex-row xl:px-10 mt-10 xl:space-x-5">
                        <div className="flex-1">
                            {loadingData ? (
                                <div className="m-5 flex flex-col lg:flex-row items-center">
                                    <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-1/4 w-full rounded-lg' />
                                    <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-2/4 w-full lg:mx-5 my-4 rounded-lg' />
                                    <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-1/4 w-full lg:ml-2 rounded-lg' />
                                </div>
                            ) : (
                                <div className="m-5 flex flex-col lg:flex-row items-center">
                                    <span className="font-bold lg:w-1/4 w-full pt-2">Tên bảng giá:</span>
                                    <TextField
                                        type="text"
                                        className="lg:w-2/4 w-full lg:mx-5 my-4"
                                        onChange={(e) => handlePriceNameChange(e.target.value)}
                                        value={priceName}
                                        label="Nhập tên bảng giá"
                                        variant="standard"
                                    />
                                    <Button
                                        onClick={handleCreatePrice}
                                        className="lg:w-1/4 w-full lg:ml-2 py-2 text-[14px] hover:bg-blue-400 bg-[#0090d9] text-white"
                                    >
                                        Tạo bảng giá mới
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            {loadingData ? (
                                <div className="m-5 flex flex-col lg:flex-row items-center">
                                    <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-1/4 w-full rounded-lg' />
                                    <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-2/4 w-full lg:mx-5 my-4 rounded-lg' />
                                    <Skeleton animation="wave" variant="rectangular" height={30} className='lg:w-1/4 w-full lg:ml-2 rounded-lg' />
                                </div>
                            ) : (
                                <div className="m-5 flex flex-col lg:flex-row items-center">
                                    <span className="font-bold lg:w-1/4 w-full">Khách hàng:</span>
                                    <FormControl className='lg:w-2/4 w-full lg:mx-5 my-4'>
                                        <InputLabel id="demo-multiple-checkbox-label">Chọn khách hàng</InputLabel>
                                        <Select
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={customerName}
                                            onChange={handleChange}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                            variant='standard'
                                        >
                                            {customers.map((customer) => (
                                                <MenuItem key={customer.id} value={customer.fullName}>
                                                    <Checkbox checked={customerName.includes(customer.fullName)} />
                                                    <ListItemText primary={customer.fullName} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        onClick={handleApplyPrice}
                                        className="lg:w-1/4 w-full lg:ml-2 py-2 text-[14px] hover:bg-blue-400 bg-[#0090d9] text-white"
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="mx-10 max-h-[300px] overflow-y-auto lg:px-5">
                            {loadingData ? (
                                <Skeleton animation="wave" variant="rectangular" height={40} className='w-[200px] rounded-lg mt-2' />
                            ) : (
                                <div className='flex items-center'>
                                    <Autocomplete
                                        className='w-[200px] mb-5'
                                        options={prices}
                                        getOptionLabel={(option) => option.name}
                                        defaultValue={prices[0]}
                                        value={selectedPrice}
                                        disableClearable
                                        onChange={(event, newValue) => setSelectedPrice(newValue)}
                                        disablePortal
                                        renderInput={(params) => <TextField {...params} variant='standard' label="Bảng giá" />}
                                    />
                                    {selectedPrice?.id !== 1 && (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    setNewPriceName(selectedPrice?.name);
                                                    setShowInput(true)
                                                }}
                                                className="w-fit ml-5 py-2 text-[14px] hover:bg-green-500 text-white"
                                            >
                                                Sửa
                                            </Button>
                                            <Dialog open={showInput} onClose={() => setShowInput(false)}>
                                                <div className='flex justify-between min-w-[400px]'>
                                                    <DialogTitle>Cập nhật bảng giá</DialogTitle>
                                                    <X size={20} className='cursor-pointer mx-3 my-5 text-black' onClick={() => setShowInput(false)} />
                                                </div>
                                                <DialogContent>
                                                    <TextField
                                                        label="Nhập tên bảng giá"
                                                        variant="standard"
                                                        value={newPriceName}
                                                        onChange={(e) => setNewPriceName(e.target.value)}
                                                        fullWidth
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button
                                                        onClick={handleUpdatePrice}
                                                        className='mx-3 mb-2'
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                            <Button
                                                onClick={handleDeletePrice}
                                                className="w-fit ml-3 py-2 text-[14px] hover:bg-red-500 bg-red-600 text-white"
                                            >
                                                Xóa
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                            {loadingData ? (
                                <div className="my-2">
                                    <Skeleton animation="wave" variant="rectangular" height={40} className='w-full rounded-lg mt-2' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} className='w-full rounded-lg mt-2' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} className='w-full rounded-lg mt-2' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} className='w-full rounded-lg mt-2' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} className='w-full rounded-lg mt-2' />
                                </div>
                            ) : (
                                priceCustomer?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {priceCustomer?.map((customer: any) => (
                                            <div
                                                key={customer.id}
                                                className="flex items-center w-full justify-between space-x-2 px-2 border-2 border-gray-300 rounded-md"
                                            >
                                                <span className="text-center text-[14px]">{customer.fullName}</span>
                                                <div className="relative group mt-2">
                                                    <button type="button" className="text-gray-600">
                                                        <Trash2 width={20} />
                                                    </button>
                                                    <span className="absolute text-center w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                        Xóa
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full flex border border-gray-300 justify-center mt-2 items-center py-10 text-gray-500">
                                        Danh sách rỗng
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className='w-full flex justify-center align-bottom items-center mt-5 mb-10'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} className='w-[80px] px-5 py-3 rounded-lg' />
                        ) : (
                            <Button type='button' onClick={() => {
                                window.history.back();
                                setOnPageChange(true);
                            }} className='px-5 py-3 text-[14px] hover:bg-green-500'>
                                <strong>Trở về</strong>
                            </Button>
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
