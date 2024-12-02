/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/config/axiosConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '@/config/firebaseConfig';
import { Autocomplete, Skeleton, TextField } from '@mui/material';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import FloatingButton from '@/components/floating/floatingButton';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import CreateProductPageBreadcrumb from '@/app/(admin)/products/create/breadcrumb';

type UnitWeightPair = {
    productUnit: string;
    weightPerUnit: number;
};

interface RowData {
    [key: string]: any;
}

const Page = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [image, setImage] = useState<string>("");
    const [loadingData, setLoadingData] = useState(true);
    const [suppliers, setSuppliers] = useState<RowData[]>([]);
    const [categories, setCategories] = useState<RowData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<RowData | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<RowData | null>(null);
    const [onPageChange, setOnPageChange] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore();

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

    const getCategories = async () => {
        try {
            const url = `/categories/all`;
            const response = await api.get(url);
            const data = response.data;
            setCategories(data.filter((c: any) => c.active === true));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách danh mục!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    const getSuppliers = async () => {
        try {
            const url = `/suppliers/all`;
            const response = await api.get(url);
            const data = response.data;
            setSuppliers(data.filter((s: any) => s.active === true));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách nhà cung cấp!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    useEffect(() => {
        getSuppliers();
        getCategories();
        setBreadcrumb(<CreateProductPageBreadcrumb />)

        const timer = setTimeout(() => {
            setLoadingData(false);
        }, 1000);
        return () => {
            clearTimeout(timer)
            setBreadcrumb(null)
        };
    }, []);

    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        categoryId: number;
        supplierId: number;
        price: number,
        image: string;
        unitOfMeasureId: number;
        warehouseId: number;
        unitWeightPairsList: UnitWeightPair[];
    }>({
        name: '',
        description: '',
        categoryId: 0,
        supplierId: 0,
        image: '',
        price: 0,
        unitOfMeasureId: 1,
        warehouseId: 0,
        unitWeightPairsList: [
            {
                productUnit: '',
                weightPerUnit: 0,
            },
        ]
    });

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        if (field !== 'productUnit' && field !== 'weightPerUnit') {
            setFormData((prevData) => ({
                ...prevData,
                [field]: value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                unitWeightPairsList: [
                    {
                        ...prevData.unitWeightPairsList[0],
                        [field]: value,
                    },
                ],
            }));
        }
    };

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

            updatedFormData = {
                ...updatedFormData,
                categoryId: selectedCategory?.id,
                supplierId: selectedSupplier?.id,
                warehouseId: 2,
            };

            const response = await api.post(`/products/createProduct`, updatedFormData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Tạo thành công',
                    description: `Sản phẩm đã được tạo thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push("/products");
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
            setOnPageChange(false);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className='flex my-10 justify-center w-full'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin sản phẩm'].map((label, index) => (
                                <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                    <button
                                        type='button'
                                        onClick={() => setChoice(index === 0)}
                                        className={`w-[100%] mt-5 lg:mt-10 p-[7px] cursor-default ${choice === (index === 0)
                                            ? 'text-white bg-[#4ba94d]'
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
                    {loadingData ? (
                        <div className='flex flex-col lg:flex-row lg:px-10 px-2'>
                            <div className='flex-1'>
                                <div className='mt-10 xl:px-10 flex flex-col items-center'>
                                    <Skeleton animation="wave" variant="rectangular" height={'400px'} width={'90%'} />
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
                                <div className='mt-10 flex flex-col items-center'>
                                    <img
                                        src={image || "https://via.placeholder.com/400"}
                                        alt='Avatar'
                                        className="w-[80%] h-[auto] border-[5px] border-black object-cover"
                                    />
                                    <label htmlFor="fileInput" className="mt-4 px-4 py-2 font-bold text-[14px] cursor-pointer hover:bg-blue-400 bg-[#0090d9] rounded-lg text-white">
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
                            </div>
                            <div className='flex-1'>
                                <div className='mx-10 mb-10 mt-5 lg:m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Tên sản phẩm: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                        value={formData.name.toString()}
                                        label={'Nhập tên sản phẩm'}
                                        variant="standard" />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Danh mục: </span>
                                    <Autocomplete
                                        className='flex-[2]'
                                        disablePortal
                                        options={categories}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                                        renderInput={(params) => <TextField {...params} variant='standard' label="Chọn danh mục" />}
                                    />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Nhà cung cấp: </span>
                                    <Autocomplete
                                        className='flex-[2]'
                                        disablePortal
                                        options={suppliers}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, newValue) => setSelectedSupplier(newValue)}
                                        renderInput={(params) => <TextField {...params} variant='standard' label="Chọn nhà cung cấp" />}
                                    />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1 pt-4'>Mô tả: </span>
                                    <TextField
                                        type={'text'}
                                        className='flex-[2]'
                                        onChange={(e) => handleFieldChange('description', e.target.value)}
                                        value={formData.description.toString()}
                                        label={'Nhập mô tả'}
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
                                    router.push("/products")
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
