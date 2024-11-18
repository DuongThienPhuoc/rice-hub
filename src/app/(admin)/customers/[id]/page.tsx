/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import api from "@/config/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, PlusIcon, Upload } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '@/config/firebaseConfig';

const Page = ({ params }: { params: { id: number } }) => {
    const { toast } = useToast();
    const [customer, setCustomer] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        const storage = getStorage(firebase);

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Chỉ được phép tải lên tệp hình ảnh!');
                return;
            }

            const storageRef = ref(storage, `images/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            try {
                const url = `/contracts/updateContract`;
                await api.post(url, {
                    imageFilePath: downloadURL,
                    id: customer?.contracts[selectedImageIndex].id
                });
                toast({
                    variant: 'default',
                    title: 'Tải thành công!',
                    description: 'Tải lên hợp đồng thành công',
                    duration: 3000
                })
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Tải thất bại!',
                    description: 'Xin vui lòng thử lại sau',
                    duration: 3000
                })
            }
        }
    };

    useEffect(() => {
        const getCustomer = async () => {
            setLoadingData(true);
            try {
                const url = `/customer/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                setCustomer(data);
                setSelectedImageIndex(0);
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

    const checkDuration = ((duration: any, confirmationDate: any) => {
        const expiryDate = confirmationDate ? new Date(confirmationDate.getTime()) : null;
        if (expiryDate) {
            expiryDate.setMonth(expiryDate.getMonth() + duration);
        }
        const isExpired = expiryDate && expiryDate < new Date();

        return isExpired;
    });

    return (
        <div>
            <div className='flex my-10 justify-center w-full'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin khách hàng', 'Thông tin hợp đồng'].map((label, index) => (
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
                    {choice && (
                        <div className='mt-10 flex flex-col items-center'>
                            {loadingData ? (
                                <Skeleton animation="wave" variant="circular" height={'8rem'} width={'8rem'} />
                            ) : (
                                <img
                                    src={customer?.image || "https://via.placeholder.com/150"}
                                    alt='Avatar'
                                    className="w-32 h-32 rounded-full border-[5px] border-black object-cover"
                                />
                            )}
                        </div>
                    )}
                    <div className='flex flex-col lg:flex-row lg:px-5'>
                        {choice ? (
                            loadingData ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <div className='flex-1'>
                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Tên khách hàng: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.fullName || 'Chưa có thông tin'}</span>
                                        </div>

                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Giới tính: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.gender === true ? 'Nam' : 'Nữ'}</span>
                                        </div>

                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Ngày sinh: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(customer?.dob)}</span>
                                        </div>

                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Số điện thoại: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.phone || 'Chưa có thông tin'}</span>
                                        </div>

                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Địa chỉ: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.address || 'Chưa có thông tin'}</span>
                                        </div>

                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Email: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.email || 'Chưa có thông tin'}</span>
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <div className='lg:m-10 mb-10 mx-10 mt-0 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Tổng đơn hàng: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.totalOrders || '0'}</span>
                                        </div>
                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Tổng nợ: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.totalDebt || '0'}</span>
                                        </div>
                                        <div className='m-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Lần cuối mua hàng: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(customer?.lastPurchase)}</span>
                                        </div>
                                    </div>
                                </>
                            )
                        ) : (
                            <>
                                <div className="flex-1 flex w-full flex-col items-center my-10">
                                    <div className='w-full flex items-center'>
                                        <button disabled={selectedImageIndex === 0} onClick={() => setSelectedImageIndex(selectedImageIndex - 1)} className='bg-green-500 hover:bg-green-300 rounded-full pr-0.5 mx-2'><ChevronLeft color='white' /></button>
                                        <div className="w-full mb-4 border-[3px] border-black">
                                            {customer?.contracts && customer?.contracts.length > 0 ? (
                                                customer.contracts.map((contract: any, index: number) => {
                                                    return (
                                                        contract.imageFilePath ? (
                                                            <div
                                                                key={index}
                                                                style={{ backgroundImage: `url(${contract.imageFilePath})` }}
                                                                className={`w-full min-h-[700px] bg-cover bg-center ${selectedImageIndex !== index ? 'hidden' : ''}`}
                                                            />
                                                        ) : (
                                                            <iframe
                                                                key={index}
                                                                src={contract.pdfFilePath}
                                                                className={`w-full min-h-[700px] ${selectedImageIndex !== index ? 'hidden' : ''}`}
                                                                title="PDF Viewer"
                                                            />
                                                        )
                                                    );
                                                })
                                            ) : (
                                                <p>Không có dữ liệu</p>
                                            )}
                                        </div>
                                        <button disabled={selectedImageIndex === customer?.contracts?.length - 1} onClick={() => setSelectedImageIndex(selectedImageIndex + 1)} className='bg-green-500 hover:bg-green-300 rounded-full pl-0.5 mx-2'><ChevronRight color='white' /></button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {selectedImageIndex > 1 && (
                                            <div
                                                className="w-20 h-20 flex items-center justify-center cursor-pointer border-[3px] border-black"
                                            >
                                                <span className="text-gray-500 font-bold">{selectedImageIndex - 1}</span>
                                            </div>
                                        )}

                                        {customer?.contracts.slice(Math.max(0, selectedImageIndex - 1), Math.min(customer?.contracts.length, selectedImageIndex + 2)).map((contract: any, index: any) => (
                                            <img
                                                key={index}
                                                onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1) + index)}
                                                src={contract.imageFilePath || 'https://via.placeholder.com/150'}
                                                alt={`Small ${Math.max(0, selectedImageIndex - 1) + index}`}
                                                className={`w-20 h-20 object-cover cursor-pointer border-[3px] ${Math.max(0, selectedImageIndex - 1) + index === selectedImageIndex ? 'border-blue-500' : 'border-black'
                                                    }`}
                                            />
                                        ))}

                                        {selectedImageIndex < customer?.contracts?.length - 2 && (
                                            <div
                                                className="w-20 h-20 flex items-center justify-center cursor-pointer border-[3px] border-black"
                                            >
                                                <span className="text-gray-500 font-bold">{customer?.contracts?.length - selectedImageIndex - 2}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex-1 lg:my-10 mb-10 mt-0'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã hợp đồng: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.contracts[selectedImageIndex]?.contractNumber || 'Chưa có thông tin'}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày tạo: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.contracts[selectedImageIndex]?.contractTime ? new Intl.DateTimeFormat('en-GB').format(new Date(customer?.contracts[selectedImageIndex]?.contractTime)) : 'Chưa có thông tin'}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày ký: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.contracts[selectedImageIndex]?.confirmationDate ? new Intl.DateTimeFormat('en-GB').format(new Date(customer?.contracts[selectedImageIndex]?.confirmationDate)) : 'Chưa có thông tin'}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Thời hạn: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.contracts[selectedImageIndex]?.contractDuration} tháng</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Trạng thái: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>
                                            {customer?.contracts[selectedImageIndex]?.confirmed
                                                ? checkDuration(customer?.contracts[selectedImageIndex]?.contractDuration, new Date(customer?.contracts[selectedImageIndex]?.confirmationDate))
                                                    ? 'Đã hết hiệu lực'
                                                    : 'Còn hiệu lực'
                                                : 'Chưa có hiệu lực'
                                            }
                                        </span>
                                    </div>
                                    <div className='my-10 ml-10 flex mr-2 lg:justify-end xl:flex-row flex-col space-y-2 items-end xl:space-y-0 xl:space-x-2'>
                                        <Button onClick={handleButtonClick} type='button' className='font-semibold w-fit px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                            Tải lên hợp đồng <Upload />
                                        </Button>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <Button onClick={() => router.push(`/contracts/create/${params.id}`)} type='button' className='w-fit font-semibold px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                            Tạo hợp đồng <PlusIcon />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {choice && (
                        <div className='w-full flex justify-center items-center my-10'>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                    <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                                </>
                            ) : (
                                <>
                                    <Button type='button' onClick={() => router.push(`/customers/update/${params.id}`)} className='px-5 mr-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                        <strong>Sửa</strong>
                                    </Button>
                                    <Button type='button' onClick={() => router.push("/customers")} className='px-5 ml-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                        <strong>Trở về</strong>
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
};

export default Page;
