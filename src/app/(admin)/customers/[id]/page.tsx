/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import PopupCreate from '@/components/popup/popupCreate';
import { PlusIcon } from 'lucide-react';

const Page = ({ params }: { params: { id: number } }) => {
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [customer, setCustomer] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const titles = [
        { name: 'id', displayName: 'Mã danh mục', type: 'hidden' },
        { name: 'signDate', displayName: 'Ngày ký', type: 'text' },
        { name: 'duration', displayName: 'Thời hạn', type: 'text' },
        { name: 'totalValue', displayName: 'Tổng giá trị', type: 'number' },
        { name: 'status', displayName: 'Trạng thái', type: 'text' },
        { name: 'contractImg', displayName: 'Hợp đồng', type: 'file' },
    ];

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
                console.log(url);
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

    const images = [
        'https://fast.com.vn/wp-content/uploads/2024/04/mau-hop-dong-mua-ban-hang-hoa-don-gian-moi.jpg',
        'https://luatquanghuy.vn/wp-content/uploads/mau-hop-dong-mua-ban-nha-image-01.webp',
        'https://fast.com.vn/wp-content/uploads/2024/04/mau-hop-dong-mua-ban-hang-hoa-don-gian-moi.jpg',
        'https://luatquanghuy.vn/wp-content/uploads/mau-hop-dong-mua-ban-nha-image-01.webp',
        'https://fast.com.vn/wp-content/uploads/2024/04/mau-hop-dong-mua-ban-hang-hoa-don-gian-moi.jpg',
        'https://luatquanghuy.vn/wp-content/uploads/mau-hop-dong-mua-ban-nha-image-01.webp',
        'https://fast.com.vn/wp-content/uploads/2024/04/mau-hop-dong-mua-ban-hang-hoa-don-gian-moi.jpg',
        'https://luatquanghuy.vn/wp-content/uploads/mau-hop-dong-mua-ban-nha-image-01.webp',
        'https://fast.com.vn/wp-content/uploads/2024/04/mau-hop-dong-mua-ban-hang-hoa-don-gian-moi.jpg',
    ];

    const openPopup = () => setPopupVisible(true);
    const closeCreate = () => {
        setPopupVisible(false);
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

    const openImageInNewTab = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div>
            <div className='flex my-16 justify-center w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin khách hàng', 'Thông tin hợp đồng'].map((label, index) => (
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
                    {choice && (
                        <div className='mt-10 flex flex-col items-center'>
                            <img
                                src={customer?.image || "https://via.placeholder.com/150"}
                                alt='Avatar'
                                className="w-32 h-32 rounded-full border-[5px] border-black object-cover"
                            />
                        </div>
                    )}
                    <div className='flex flex-col lg:flex-row px-10'>
                        {choice ? (
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
                        ) : (
                            <>
                                <div className="flex-1 flex flex-col items-center my-10 mx-auto">
                                    <div className="w-full max-w-2xl mb-4 border-[3px] border-black">
                                        <img src={images[selectedImageIndex]} alt="Large Display" className="w-full object-cover" />
                                    </div>

                                    {navbarVisible ? (
                                        <div className="w-auto flex space-x-2">
                                            {images.slice(0, 4).map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Small ${index + 1}`}
                                                    className={`w-20 h-20 object-cover cursor-pointer border-[3px] ${index + 1 === selectedImageIndex ? 'border-blue-500' : 'border-black'}`}
                                                    onClick={() => handleClickImage(index + 1)}
                                                />
                                            ))}
                                            {images.length > 4 && (
                                                <div onClick={handleOpenPopup} className="w-20 h-20 relative flex items-center justify-center cursor-pointer border-[3px] border-black">
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${images[4]})`,
                                                            opacity: 0.2
                                                        }}
                                                    ></div>
                                                    <div className="relative z-2 font-bold bg-gray-200 rounded-full px-1">
                                                        +{images.length - 4}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full flex space-x-2">
                                            {images.slice(0, 2).map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Small ${index + 1}`}
                                                    className={`w-20 h-20 object-cover cursor-pointer border-[3px] ${index + 1 === selectedImageIndex ? 'border-blue-500' : 'border-black'}`}
                                                    onClick={() => handleClickImage(index + 1)}
                                                />
                                            ))}
                                            {images.length > 2 && (
                                                <div onClick={handleOpenPopup} className="w-20 h-20 relative flex items-center justify-center cursor-pointer border-[3px] border-black">
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${images[2]})`,
                                                            opacity: 0.2
                                                        }}
                                                    ></div>
                                                    <div className="relative z-2 font-bold bg-gray-200 rounded-full px-1">
                                                        +{images.length - 2}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1 lg:my-10 mb-10 mt-0'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã hợp đồng: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>Chưa có thông tin</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày ký: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>Chưa có thông tin</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Thời hạn: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>Chưa có thông tin</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Tổng giá trị: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>Chưa có thông tin</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Trạng thái: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>Chưa có thông tin</span>
                                    </div>
                                    <div className='m-10 flex justify-center lg:justify-end'>
                                        <Button onClick={openPopup} type='button' className='font-semibold px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                            Tạo hợp đồng <PlusIcon />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {choice && (
                        <div className='w-full flex justify-center items-center my-10'>
                            <Button type='button' onClick={() => router.push(`/customers/update/${params.id}`)} className='px-5 mr-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                <strong>Sửa</strong>
                            </Button>
                            <Button type='button' onClick={() => router.push("/customers")} className='px-5 ml-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                <strong>Trở về</strong>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {isPopupVisible && <PopupCreate tableName="Hợp đồng" url="/contract/createContract" titles={titles} handleClose={closeCreate} />}
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
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="cursor-pointer"
                                onClick={() => openImageInNewTab(img)}
                            >
                                <img
                                    src={img}
                                    alt={`Contract ${index + 1}`}
                                    className="w-full h-auto object-cover border-[3px] border-black"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default Page;
