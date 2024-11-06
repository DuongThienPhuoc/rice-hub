/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import { PlusIcon, Printer, Upload } from 'lucide-react';
import { Skeleton } from '@mui/material';

const Page = ({ params }: { params: { id: number } }) => {
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [customer, setCustomer] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loadingData, setLoadingData] = useState(true);

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
            setLoadingData(true);
            try {
                const url = `/customer/${params.id}`;
                console.log(url);
                const response = await api.get(url);
                const data = response.data;
                setCustomer(data);
                setSelectedImageIndex(0);
                console.log(data);
            } catch (error) {
                console.error("Error fetching customer:", error);
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

    const handleClickImage = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

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
            <div className='flex my-10 justify-center w-full font-arsenal'>
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
                    <div className='flex flex-col lg:flex-row px-10'>
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
                                <div className="flex-1 flex flex-col items-center my-10 mx-auto pr-10">
                                    <div className="w-full max-w-2xl mb-4 border-[3px] border-black">
                                        <img src={customer?.contracts[selectedImageIndex].imageFilePath || 'https://via.placeholder.com/150'} alt="Large Display" className="w-full object-cover" />
                                    </div>

                                    {navbarVisible ? (
                                        <div className="w-auto flex space-x-2">
                                            {customer?.contracts.slice(0, 4).map((contract: any, index: any) => (
                                                <img
                                                    key={index}
                                                    src={contract.imageFilePath || 'https://via.placeholder.com/150'}
                                                    alt={`Small ${index}`}
                                                    className={`w-20 h-20 object-cover cursor-pointer border-[3px] ${index === selectedImageIndex ? 'border-blue-500' : 'border-black'}`}
                                                    onClick={() => handleClickImage(index)}
                                                />
                                            ))}
                                            {customer?.contracts.length > 4 && (
                                                <div onClick={handleOpenPopup} className="w-20 h-20 relative flex items-center justify-center cursor-pointer border-[3px] border-black">
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${customer?.contracts[4].imageFilePath || 'https://via.placeholder.com/150'})`,
                                                            opacity: 0.2
                                                        }}
                                                    ></div>
                                                    <div className="relative z-2 font-bold bg-gray-200 rounded-full px-1">
                                                        +{customer?.contracts.length - 4}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full flex space-x-2">
                                            {customer?.contracts.slice(0, 2).map((contract: any, index: any) => (
                                                <img
                                                    key={index}
                                                    src={contract.imageFilePath || 'https://via.placeholder.com/150'}
                                                    alt={`Small ${index}`}
                                                    className={`w-20 h-20 object-cover cursor-pointer border-[3px] ${index === selectedImageIndex ? 'border-blue-500' : 'border-black'}`}
                                                    onClick={() => handleClickImage(index)}
                                                />
                                            ))}
                                            {customer?.contracts.length > 2 && (
                                                <div onClick={handleOpenPopup} className="w-20 h-20 relative flex items-center justify-center cursor-pointer border-[3px] border-black">
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${customer?.contracts[2].imageFilePath || 'https://via.placeholder.com/150'})`,
                                                            opacity: 0.2
                                                        }}
                                                    ></div>
                                                    <div className="relative z-2 font-bold bg-gray-200 rounded-full px-1">
                                                        +{customer?.contracts.length - 2}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1 lg:my-10 mb-10 mt-0'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã hợp đồng: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{customer?.contracts[selectedImageIndex]?.contractNumber || 'Chưa có thông tin'}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày tạo: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{new Intl.DateTimeFormat('en-GB').format(new Date(customer?.contracts[selectedImageIndex]?.contractTime)) || 'Chưa có thông tin'}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày ký: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{new Intl.DateTimeFormat('en-GB').format(new Date(customer?.contracts[selectedImageIndex]?.confirmationDate)) || 'Chưa có thông tin'}</span>
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
                                    <div className='m-10 flex lg:justify-between'>
                                        <Button type='button' className='font-semibold px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                            Cập nhật <Upload />
                                        </Button>
                                        <Button type='button' className='font-semibold px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                            In hợp đồng <Printer />
                                        </Button>
                                        <Button onClick={() => window.open(`/contracts/create/${params.id}`, "_blank")} type='button' className='font-semibold px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
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

            <Modal
                isOpen={isPopupOpen}
                onRequestClose={handleClosePopup}
                contentLabel="Danh sách hợp đồng"
                ariaHideApp={false}
                className="bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center"
            >
                <div className='bg-white p-10 rounded-lg w-[80%] h-[90%] relative overflow-y-auto'>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Danh sách hợp đồng</h2>
                        <button onClick={handleClosePopup}><strong>Đóng</strong></button>
                    </div>
                    <div className="grid xl:grid-cols-10 lg:grid-cols-5 grid-cols-2 gap-4 mt-10">
                        {customer?.contracts.map((contract: any, index: any) => (
                            <div
                                key={index}
                                className="cursor-pointer"
                            // onClick={() => openImageInNewTab(img)}
                            >
                                <img
                                    src={contract.imageFilePath || 'https://via.placeholder.com/150'}
                                    alt={`Contract ${index + 1}`}
                                    className="w-full h-auto object-cover border-[3px] border-black"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div >
    )
};

export default Page;
