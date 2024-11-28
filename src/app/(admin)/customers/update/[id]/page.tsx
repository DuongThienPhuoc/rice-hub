/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "@/config/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '@/config/firebaseConfig';
import { FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import FloatingButton from '@/components/floating/floatingButton';

const Page = ({ params }: { params: { id: number } }) => {
    const { toast } = useToast();
    const [customer, setCustomer] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [formData, setFormData] = useState<Record<string, string | boolean | number>>({});
    const [image, setImage] = useState<string>("");
    const [loadingData, setLoadingData] = useState(true);
    const [onPageChange, setOnPageChange] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const getCustomer = async () => {
            try {
                const url = `/customer/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                setCustomer(data);
                if (!data?.id) {
                    toast({
                        variant: 'destructive',
                        title: 'Lỗi khi lấy thông tin khách hàng!',
                        description: 'Xin vui lòng thử lại',
                        duration: 3000
                    })
                }
            } catch (error: any) {
                if (error.response.status === 404) {
                    toast({
                        variant: 'destructive',
                        title: 'Khách hàng không tồn tại!',
                        description: 'Xin vui lòng thử lại',
                        duration: 3000
                    })
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Hệ thống gặp sự cố khi lấy thông tin khách hàng!',
                        description: 'Xin vui lòng thử lại sau',
                        duration: 3000
                    })
                }
            } finally {
                setLoadingData(false);
            }
        };

        if (params.id) {
            getCustomer();
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOnPageChange(true);
        try {
            const storage = getStorage(firebase);
            const fileInput = document.getElementById("fileInput") as HTMLInputElement;
            const file = fileInput?.files?.[0];
            let updatedFormData = { ...formData };

            if (file) {
                const storageRef = ref(storage, `images/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                updatedFormData = {
                    ...updatedFormData,
                    image: downloadURL,
                };
            }

            const response = await api.post(`/customer/updateCustomer`, updatedFormData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Cập nhật thành công',
                    description: `Khách hàng đã được cập nhật thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push(`/customers/${params.id}`);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Cập nhật thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
                setOnPageChange(false);
            }
        } catch (error: any) {
            const messages = error?.response?.data?.message || ['Đã xảy ra lỗi, vui lòng thử lại.'];
            toast({
                variant: 'destructive',
                title: 'Cập nhật thất bại',
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
            setOnPageChange(false);
        }
    };

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (customer) {
            setFormData({
                id: params.id,
                fullName: customer.fullName,
                email: customer.email,
                username: customer.username,
                phoneNumber: customer.phone,
                address: customer.address,
                dob: customer.dob,
                userType: 'ROLE_CUSTOMER',
                description: customer.description,
                active: true,
                gender: Boolean(customer.gender),
                image: customer.image,
            });
            setImage(customer.image);
        }
    }, [customer, params.id]);

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex my-10 justify-center px-5 w-full'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin khách hàng', 'Thông tin đăng nhập'].map((label, index) => (
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
                    <div className='mt-10 flex flex-col items-center'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="circular" height={'8rem'} width={'8rem'} />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg mt-4 px-4 py-2' />
                            </>
                        ) : (
                            <>
                                <img
                                    src={image || "https://via.placeholder.com/150"}
                                    alt='Avatar'
                                    className="w-32 h-32 rounded-full border-[5px] border-black object-cover"
                                />
                                <label htmlFor="fileInput" className="mt-4 px-4 py-2 font-bold text-[14px] hover:bg-blue-400 bg-[#0090d9] cursor-pointer rounded-lg text-white">
                                    {image ? 'Thay ảnh' : 'Thêm ảnh'}
                                </label>
                            </>
                        )}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    {choice ? (
                        loadingData ? (
                            <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
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
                            <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                                <div className='flex-1'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Tên khách hàng: </span>
                                        <TextField
                                            type={'text'}
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                            value={formData.fullName?.toString() || ''}
                                            label={'Nhập đầy đủ họ và tên'}
                                            variant="standard" />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Giới tính: </span>
                                        <FormControl className='flex-[2]' variant="standard" sx={{ minWidth: 120 }}>
                                            <InputLabel id="demo-simple-select-standard-label">Giới tính</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={formData?.gender === '' ? '' : (formData?.gender === true ? "true" : "false")}
                                                onChange={(e) => handleFieldChange('gender', e.target.value === "true" ? true : false)}
                                                label="Chọn giới tính"
                                            >
                                                <MenuItem value="">
                                                    <em>Chọn giới tính</em>
                                                </MenuItem>
                                                <MenuItem value={'true'}>Nam</MenuItem>
                                                <MenuItem value={'false'}>Nữ</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Ngày sinh: </span>
                                        <TextField
                                            type='date'
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('dob', e.target.value)}
                                            value={formData.dob ? formData.dob.toString().split('T')[0] : ''}
                                            variant="standard" />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Số điện thoại: </span>
                                        <TextField
                                            type='text'
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            value={formData.phone?.toString() || ''}
                                            label='Nhập số điện thoại'
                                            variant="standard" />
                                    </div>
                                </div >
                                <div className='flex-1'>
                                    <div className='mx-10 mb-10 mt-0 lg:m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Địa chỉ: </span>
                                        <TextField
                                            type='text'
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('address', e.target.value)}
                                            value={formData.address?.toString() || ''}
                                            label='Nhập địa chỉ'
                                            variant="standard" />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Email: </span>
                                        <TextField
                                            type='text'
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            value={formData.email?.toString() || ''}
                                            label='Nhập địa chỉ email'
                                            variant="standard" />
                                    </div>
                                </div>
                            </div >
                        )
                    ) : (
                        <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                            <div className='flex-1'>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Tên đăng nhập: </span>
                                    <TextField
                                        type='text'
                                        className='flex-[2]'
                                        disabled
                                        value={formData.username?.toString() || ''}
                                        label='Nhập tên đăng nhập'
                                        variant="standard" />
                                </div>
                            </div>
                            <div className='flex-1'>
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
                                <Button type='submit' className='mr-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Cập nhật</strong>
                                </Button>
                                <Button type='button' onClick={() => {
                                    router.push(`/customers/${params.id}`)
                                    setOnPageChange(true);
                                }} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div >
            </form >
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