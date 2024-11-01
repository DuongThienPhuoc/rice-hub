/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "../../../../api/axiosConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '../../../../api/firebaseConfig';
import { FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';

const Page = () => {
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [image, setImage] = useState<string>("");
    const [loadingData, setLoadingData] = useState(true);

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
        const timer = setTimeout(() => {
            setLoadingData(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const [formData, setFormData] = useState<Record<string, string | boolean | number>>({
        name: '',
        email: '',
        username: '',
        password: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        userType: 'ROLE_EMPLOYEE',
        employeeRoleId: '',
        description: '',
        active: true,
        gender: '',
        salaryType: 'DAILY',
        dailyWage: '0',
        bankName: '',
        bankNumber: '',
    });

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const storage = getStorage(firebase);
            const fileInput = document.getElementById("fileInput") as HTMLInputElement;
            const file = fileInput?.files?.[0];
            let updatedFormData = { ...formData };

            if (file) {
                const storageRef = ref(storage, `images/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                console.log('Uploaded a file!');
                const downloadURL = await getDownloadURL(snapshot.ref);
                console.log('File available at', downloadURL);

                updatedFormData = {
                    ...updatedFormData,
                    image: downloadURL,
                };
            }

            const response = await api.post(`/user/create`, updatedFormData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Nhân viên đã được thêm thành công`);
                router.push("/employees");
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className='flex my-10 justify-center w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin nhân viên', 'Thông tin đăng nhập'].map((label, index) => (
                                <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                    <button
                                        type='button'
                                        onClick={() => setChoice(index === 0)}
                                        className={`w-[100%] mt-5 lg:mt-10 p-[7px] ${choice === (index === 0)
                                            ? 'text-white bg-black hover:bg-[#1d1d1fca]'
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
                                <label htmlFor="fileInput" className="mt-4 px-4 py-2 font-bold text-[14px] hover:bg-[#1d1d1fca] bg-black rounded-lg text-white">
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
                                        <span className='font-bold flex-1 pt-4'>Tên nhân viên: </span>
                                        <TextField
                                            type={'text'}
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            value={formData.name.toString()}
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
                                                value={formData.gender.toString()}
                                                onChange={(e) => handleFieldChange('gender', e.target.value === 'true')}
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
                                            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                                            value={formData.dateOfBirth.toString()}
                                            variant="standard" />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Số điện thoại: </span>
                                        <TextField
                                            type={'text'}
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            value={formData.phone.toString()}
                                            label={'Nhập số điện thoại'}
                                            variant="standard" />
                                    </div>

                                </div>
                                <div className='flex-1'>
                                    <div className='mx-10 mb-10 mt-0 lg:m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Địa chỉ: </span>
                                        <TextField
                                            type={'text'}
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('address', e.target.value)}
                                            value={formData.address.toString()}
                                            label={'Nhập địa chỉ'}
                                            variant="standard" />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Email: </span>
                                        <TextField
                                            type={'text'}
                                            className='flex-[2]'
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            value={formData.email.toString()}
                                            label={'Nhập địa chỉ email'}
                                            variant="standard" />
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                            <div className='flex-1'>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Tên đăng nhập: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('username', e.target.value)}
                                        value={formData.username.toString()}
                                        label={'Nhập tên đăng nhập'}
                                        variant="standard" />
                                </div>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Vị trí: </span>
                                    <FormControl className='flex-[2]' variant="standard" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Chọn vị trí</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={formData.employeeRoleId.toString()}
                                            onChange={(e) => handleFieldChange('employeeRoleId', e.target.value)}
                                            label="Chọn giới tính"
                                        >
                                            <MenuItem value="">
                                                <em>Chọn vị trí</em>
                                            </MenuItem>
                                            <MenuItem value={1}>Nhân viên quản kho</MenuItem>
                                            <MenuItem value={2}>Nhân viên bán hàng</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Mật khẩu: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('password', e.target.value)}
                                        value={formData.password.toString()}
                                        label={'Nhập mật khẩu'}
                                        variant="standard" />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='mx-10 flex flex-col lg:flex-row lg:my-10'>
                                    <span className='font-bold flex-1 pt-4'>Tên ngân hàng: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('bankName', e.target.value)}
                                        value={formData.bankName.toString()}
                                        label={'Nhập tên ngân hàng'}
                                        variant="standard" />
                                </div>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Số tài khoản ngân hàng: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('bankNumber', e.target.value)}
                                        value={formData.bankNumber.toString()}
                                        label={'Nhập số tài khoản ngân hàng'}
                                        variant="standard" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center align-bottom items-center my-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                            </>
                        ) : (
                            <>
                                <Button type='submit' className='mr-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Thêm</strong>
                                </Button>
                                <Button type='button' onClick={() => router.push("/employees")} className='ml-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Hủy</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;
