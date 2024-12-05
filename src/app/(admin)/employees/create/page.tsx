/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/config/axiosConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '@/config/firebaseConfig';
import { FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import FloatingButton from '@/components/floating/floatingButton';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import CreateEmployeePageBreadcrumb from '@/app/(admin)/employees/create/breadcrumb';

const Page = () => {
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [image, setImage] = useState<string>("");
    const [loadingData, setLoadingData] = useState(true);
    const [employeeRoles, setEmployeeRoles] = useState<any>([]);
    const { toast } = useToast();
    const [onPageChange, setOnPageChange] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumb(<CreateEmployeePageBreadcrumb />)
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

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

    const getEmployeeRoles = async () => {
        try {
            const url = `/employeerole/all`;
            const response = await api.get(url);
            const data = response.data;
            setEmployeeRoles(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy thông tin khách hàng!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getEmployeeRoles();
    }, []);

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
                toast({
                    variant: 'default',
                    title: 'Tạo thành công',
                    description: `Nhân viên đã được tạo thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push("/employees");
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


    return (
        <div>
            <form onSubmit={handleSubmit} className='flex my-10 justify-center w-full'>
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
                                    <span className='font-bold flex-1 pt-4'>Chức vụ: </span>
                                    <FormControl className='flex-[2]' variant="standard" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Chọn chức vụ</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={formData.employeeRoleId.toString()}
                                            onChange={(e) => handleFieldChange('employeeRoleId', e.target.value)}
                                            label="Chọn chức vụ"
                                        >
                                            <MenuItem value="">
                                                <em>Chọn chức vụ</em>
                                            </MenuItem>
                                            {employeeRoles &&
                                                employeeRoles?.map((role: any) => {
                                                    return (
                                                        <MenuItem key={role.id} value={role.id}>
                                                            {role.roleName === 'DRIVER' && 'Nhân viên giao hàng'}
                                                            {role.roleName === 'PORTER' && 'Nhân viên bốc/dỡ hàng'}
                                                            {role.roleName === 'WAREHOUSE_MANAGER' && 'Nhân viên quản kho'}
                                                        </MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                {formData?.employeeRoleId !== '' && formData?.employeeRoleId !== 2 && (
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1 pt-4'>Lương ngày: </span>
                                        <TextField
                                            type={'number'}
                                            className='flex-[2]'
                                            onChange={(e) => {
                                                if (Number(e.target.value) <= 0) {
                                                    handleFieldChange('dailyWage', 0)
                                                } else {
                                                    handleFieldChange('dailyWage', Number(e.target.value))
                                                }
                                            }}
                                            value={formData.dailyWage.toString()}
                                            label={'Nhập lương ngày'}
                                            variant="standard" />
                                    </div>
                                )}
                            </div>
                            <div className='flex-1'>
                                <div className='mx-10 flex flex-col lg:flex-row lg:my-10'>
                                    <span className='font-bold flex-1 pt-4'>Mật khẩu: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('password', e.target.value)}
                                        value={formData.password.toString()}
                                        label={'Nhập mật khẩu'}
                                        variant="standard" />
                                </div>
                                <div className='m-10 flex flex-col lg:flex-row'>
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
                                <Button type='submit' className='mr-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Thêm</strong>
                                </Button>
                                <Button type='button' onClick={() => {
                                    router.push("/employees")
                                    setOnPageChange(true);
                                }} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Hủy</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </form>
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
