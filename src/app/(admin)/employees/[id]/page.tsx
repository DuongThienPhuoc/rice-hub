/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import CardChip from "../../../../components/assets/img/cardChip.png"
import Image from "next/image";
import { Skeleton } from '@mui/material';

const Page = ({ params }: { params: { id: number } }) => {
    const [employee, setEmployee] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        setLoadingData(true);
        const getEmployee = async () => {
            try {
                const url = `/employees/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                setEmployee(data);
            } catch (error) {
                console.error("Error fetching employee:", error);
            } finally {
                setLoadingData(false);
            }
        };

        if (params.id) {
            getEmployee();
        }
    }, [params.id]);

    const renderDate = (value: any) => {
        if (value) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } else {
            return '../../....';
        }
    }

    return (
        <div>
            <div className='flex my-10 justify-center w-full'>
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
                    <div className='flex flex-col xl:flex-row px-10'>
                        {choice ? (
                            loadingData ? (
                                <div className='flex-[3]'>
                                    <div className='m-10 flex justify-center'>
                                        <Skeleton animation="wave" variant="circular" height={'8rem'} width={'8rem'} />
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
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex-[3]'>
                                    <div className='m-10 flex justify-center'>
                                        <img
                                            src={employee?.image || "https://via.placeholder.com/150"}
                                            alt="Avatar"
                                            className="w-32 h-32 rounded-full border-[5px] border-black object-cover"
                                        />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã nhân viên: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.employeeCode}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Tên nhân viên: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.fullName}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Giới tính: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.gender === true ? 'Nam' : 'Nữ'}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày sinh: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(employee?.dob)}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Số điện thoại: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.phone}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Địa chỉ: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.address}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Email: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.email}</span>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className='flex-[3]'>
                                <div className='m-10 flex justify-center'>
                                    <img
                                        src={employee?.image || "https://via.placeholder.com/150"}
                                        alt="Avatar"
                                        className="w-32 h-32 rounded-full border-[5px] border-black object-cover"
                                    />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Tên đăng nhập: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{employee?.username}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Ngày vào làm: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(employee?.joinDate)}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Vị trí: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>
                                        {employee?.role.employeeRole.roleName === 'ROLE_STOCK' && 'Nhân viên quản kho'}
                                        {employee?.role.employeeRole.roleName === 'ROLE_SALE' && 'Nhân viên bán hàng'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {loadingData ? (
                            <div className='flex-[3] flex justify-center lg:py-10 py-0'>
                                <Skeleton animation="wave" variant="rectangular" height={'200px'} width={'350px'} className='rounded-lg' />
                            </div>
                        ) : (
                            <div className='flex-[3] flex justify-center lg:py-10 py-0'>
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
                        )}
                    </div>
                    <div className='w-full flex justify-center items-center my-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                            </>
                        ) : (
                            <>
                                <Button type='button' onClick={() => router.push(`/employees/update/${params.id}`)} className='px-5 mr-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Sửa</strong>
                                </Button>
                                <Button type='button' onClick={() => router.push("/employees")} className='px-5 ml-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;