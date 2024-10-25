/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/navbar/sidebar';
import React, { useEffect, useState } from 'react';
import api from "../../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '../../../../../api/firebaseConfig';

const Page = ({ params }: { params: { id: number } }) => {
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [customer, setCustomer] = useState<any>(null);
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
        const updateNavbarVisibility = () => {
            const shouldShowNavbar = window.innerWidth >= 1100;
            setNavbarVisible(shouldShowNavbar);
        };

        updateNavbarVisibility();

        window.addEventListener('resize', updateNavbarVisibility);

        return () => {
            window.removeEventListener('resize', updateNavbarVisibility);
        };
    }, []);

    useEffect(() => {
        const getCustomer = async () => {
            try {
                const url = `/customer/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                setCustomer(data);
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        };

        if (params.id) {
            getCustomer();
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const storage = getStorage(firebase);
            const fileInput = document.getElementById("fileInput") as HTMLInputElement;
            const file = fileInput?.files?.[0];
            console.log("Image");
            console.log(formData);
            let updatedFormData = { ...formData };

            if (file) {
                console.log(file);
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

            const response = await api.post(`/customer/updateCustomer`, updatedFormData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Khách hàng đã được cập nhật thành công`);
                router.push("/customers");
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
    };

    useEffect(() => {
        if (customer) {
            setFormData({
                id: params.id,
                fullName: customer.fullName,
                email: customer.email,
                username: customer.username,
                phone: customer.phone,
                address: customer.address,
                dob: customer.dob,
                userType: 'ROLE_CUSTOMER',
                description: customer.description,
                active: true,
                gender: customer.gender,
                image: customer.image,
            });
            setImage(customer.image);
        }
    }, [customer, params.id]);

    return (
        <div>
            {navbarVisible ? <Navbar /> : <Sidebar />}
            <form onSubmit={handleSubmit} className='flex my-16 justify-center px-5 w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin khách hàng', 'Thông tin đăng nhập'].map((label, index) => (
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
                                    <span className='font-bold flex-1'>Tên khách hàng: </span>
                                    <input
                                        className='flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                        type='text'
                                        name='fullName'
                                        placeholder='Nhập đầy đủ họ và tên'
                                        value={formData.fullName?.toString() || ''}
                                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                    />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Giới tính: </span>
                                    <select
                                        className='flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                        name='gender'
                                        value={formData?.gender === '' ? '' : (formData?.gender === true ? "true" : "false")}
                                        onChange={(e) => handleFieldChange('gender', e.target.value === "true" ? true : false)}
                                    >
                                        <option defaultValue="">Chọn giới tính</option>
                                        <option value="true">Nam</option>
                                        <option value="false">Nữ</option>
                                    </select>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Ngày sinh: </span>
                                    <input
                                        className='flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                        type='date'
                                        name='dob'
                                        placeholder='Nhập ngày sinh'
                                        value={formData.dob ? formData.dob.toString().split('T')[0] : ''}
                                        onChange={(e) => handleFieldChange('dob', e.target.value)}
                                    />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Số điện thoại: </span>
                                    <input
                                        className='flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                        type='text'
                                        name='phone'
                                        placeholder='Nhập số điện thoại'
                                        value={formData.phone?.toString() || ''}
                                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='mx-10 mb-10 mt-0 lg:m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Địa chỉ: </span>
                                    <input
                                        className='flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                        type='text'
                                        name='address'
                                        placeholder='Nhập địa chỉ'
                                        value={formData.address?.toString() || ''}
                                        onChange={(e) => handleFieldChange('address', e.target.value)}
                                    />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Email: </span>
                                    <input
                                        className='flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
                                        type='text'
                                        name='email'
                                        placeholder='Nhập địa chỉ email'
                                        value={formData.email?.toString() || ''}
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                            <div className='flex-1'>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Tên đăng nhập: </span>
                                    <input
                                        className='cursor-not-allowed flex-[2] lg:ml-5 mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 border-b-2'
                                        type='text'
                                        name='username'
                                        readOnly
                                        placeholder='Nhập tên đăng nhập'
                                        value={formData.username?.toString() || ''}
                                    />
                                </div>
                            </div>
                            <div className='flex-1'>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center my-10'>
                        <Button type='submit' className='mr-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Cập nhật</strong>
                        </Button>
                        <Button type='button' onClick={() => router.push("/customers")} className='ml-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;