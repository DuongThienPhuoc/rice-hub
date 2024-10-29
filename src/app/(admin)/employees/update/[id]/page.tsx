/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "../../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '../../../../../api/firebaseConfig';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const Page = ({ params }: { params: { id: number } }) => {
    const [employee, setEmployee] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [formData, setFormData] = useState<Record<string, string | boolean | number>>({});
    const [image, setImage] = useState<string>("");

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
        const getEmployee = async () => {
            try {
                const url = `/employees/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                setEmployee(data);
            } catch (error) {
                console.error("Error fetching employee:", error);
            }
        };

        if (params.id) {
            getEmployee();
        }
    }, [params.id]);

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

            const response = await api.post(`/employees/updateEmployee`, updatedFormData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Nhân viên đã được cập nhật thành công`);
                router.push("/employees");
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
        console.log(employee.dob);
    };

    useEffect(() => {
        if (employee) {
            setFormData({
                id: params.id,
                fullName: employee.fullName,
                email: employee.email,
                userName: employee.username,
                phone: employee.phone,
                address: employee.address,
                dob: employee.dob,
                image: employee.image,
                userType: 'ROLE_EMPLOYEE',
                employeeRoleId: employee.role.employeeRole.id,
                description: employee.description,
                active: true,
                gender: employee.gender,
                salaryType: 'DAILY',
                dailyWage: employee.dailyWage || 0,
                bankName: employee.bankName,
                bankNumber: employee.bankNumber,
            });
            setImage(employee.image);
        }
    }, [employee, params.id]);

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex my-16 justify-center w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin nhân viên', 'Thông tin đăng nhập'].map((label, index) => (
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
                        ))}
                    </div>
                    <div className='mt-10 flex flex-col items-center'>
                        <img
                            src={image || "https://via.placeholder.com/150"}
                            alt='Avatar'
                            className="w-32 h-32 rounded-full border-[5px] border-black object-cover"
                        />
                        <label htmlFor="fileInput" className="mt-4 px-4 py-2 font-bold text-[14px] hover:bg-[#1d1d1fca] bg-black rounded-lg text-white">
                            {image ? 'Thay ảnh' : 'Thêm ảnh'}
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    {choice ? (
                        <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                            <div className='flex-1'>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Tên nhân viên: </span>
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
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                                        value={formData.phone?.toString() || ''}
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
                                        value={formData.address?.toString() || ''}
                                        label={'Nhập địa chỉ'}
                                        variant="standard" />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Email: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                        value={formData.email?.toString() || ''}
                                        label={'Nhập địa chỉ email'}
                                        variant="standard" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                            <div className='flex-1'>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Tên đăng nhập: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        disabled
                                        value={formData.userName?.toString() || ''}
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
                                            value={formData.employeeRoleId?.toString() || ''}
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
                            </div>
                            <div className='flex-1'>
                                <div className='mx-10 flex flex-col lg:flex-row lg:my-10'>
                                    <span className='font-bold flex-1 pt-4'>Tên ngân hàng: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('bankName', e.target.value)}
                                        value={formData.bankName?.toString() || ''}
                                        label={'Nhập tên ngân hàng'}
                                        variant="standard" />
                                </div>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Số tài khoản ngân hàng: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('bankNumber', e.target.value)}
                                        value={formData.bankNumber?.toString() || ''}
                                        label={'Nhập số tài khoản ngân hàng'}
                                        variant="standard" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center my-10'>
                        <Button type='submit' className='mr-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Cập nhật</strong>
                        </Button>
                        <Button type='button' onClick={() => router.push("/employees")} className='ml-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;