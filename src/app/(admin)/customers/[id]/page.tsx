/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/navbar/sidebar';
import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import CardChip from "../../../../components/assets/img/cardChip.png"
import Image from "next/image";

const Page = ({ params }: { params: { id: number } }) => {
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [employee, setEmployee] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);

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
        const getEmployee = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = `/employees/${params.id}`;
                console.log(url);
                const response = await api.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    const renderDate = (value: any) => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div>
            {navbarVisible ? <Navbar /> : <Sidebar />}
            <div className='flex my-16 justify-center px-5 w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin nhân viên', 'Thông tin đăng nhập'].map((label, index) => (
                            <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                <button
                                    type='button'
                                    onClick={() => setChoice(index === 0)}
                                    className={`w-[100%] lg:w-[90%] mt-5 lg:mt-10 p-[7px] ${choice === (index === 0)
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
                    {choice ? (
                        <div className='flex flex-col lg:flex-row px-10'>
                            <div className='flex-1 flex justify-center py-20'>
                                <div className='w-[350px] h-[200px] bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-6 shadow-lg'>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-lg font-bold'>{employee?.bankName}</div>
                                        <Image src={CardChip} alt='Chip' className='w-[40px]' />
                                    </div>
                                    <div className='mt-8'>
                                        <span className='block text-lg tracking-wider font-semibold'>{employee?.bankNumber}</span>
                                    </div>
                                    <div className='flex justify-between items-center '>
                                        <div>
                                            <div className='text-sm'>Card Holder</div>
                                            <div className='text-lg font-semibold'>{employee?.fullName}</div>
                                        </div>
                                        <div>
                                            <div className='text-sm'>Expires</div>
                                            <div className='text-lg font-semibold'>**/**</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex-1'>
                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Mã nhân viên: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.employeeCode}</strong>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Tên nhân viên: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.fullName}</strong>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Giới tính: </span>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Ngày sinh: </span>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Số điện thoại: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.phone}</strong>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='mx-10 mb-10 mt-0 lg:m-10 flex'>
                                    <span className='font-bold flex-1'>Địa chỉ: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.address}</strong>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Email: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.email}</strong>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col lg:flex-row px-10'>
                            <div className='flex-1 flex justify-center py-20'>
                                <div className='w-[350px] h-[200px] bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-6 shadow-lg'>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-lg font-bold'>{employee?.bankName}</div>
                                        <Image src={CardChip} alt='Chip' className='w-[40px]' />
                                    </div>
                                    <div className='mt-8'>
                                        <span className='block text-lg tracking-wider font-semibold'>{employee?.bankNumber}</span>
                                    </div>
                                    <div className='flex justify-between items-center '>
                                        <div>
                                            <div className='text-sm'>Card Holder</div>
                                            <div className='text-lg font-semibold'>{employee?.fullName}</div>
                                        </div>
                                        <div>
                                            <div className='text-sm'>Expires</div>
                                            <div className='text-lg font-semibold'>**/**</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Tên đăng nhập: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.username}</strong>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Ngày vào làm: </span>
                                    <strong className='flex-[2] ml-5 '>{renderDate(employee?.joinDate)}</strong>
                                </div>

                                <div className='m-10 flex'>
                                    <span className='font-bold flex-1'>Vị trí: </span>
                                    <strong className='flex-[2] ml-5 '>{employee?.role.employeeRole.roleName}</strong>
                                </div>
                            </div>
                            <div className='flex-1'>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center my-10'>
                        <Button type='button' onClick={() => router.push(`/employees/${params.id}`)} className='ml-2 mt-4 lg:mt-0 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Sửa</strong>
                        </Button>
                        <Button type='button' onClick={() => router.push("/employees")} className='ml-2 mt-4 lg:mt-0 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;