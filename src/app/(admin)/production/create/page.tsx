/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/config/axiosConfig";
import { Autocomplete, Skeleton, TextField, Paper, TableFooter } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Trash2 } from 'lucide-react';
import FloatingButton from '@/components/floating/floatingButton';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ProductionPageBreadcrumb from '@/app/(admin)/production/create/breadcrumb';

interface RowData {
    [key: string]: any;
}

const Page = () => {
    const router = useRouter();
    const [ingredients, setIngredients] = useState<RowData[]>([]);
    const [products, setProducts] = useState<RowData[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<RowData | null>(null);
    const [selectedType, setSelectedType] = useState<RowData | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [inputWeight, setInputWeight] = useState<any>('');
    const [outputs, setOutputs] = useState<any>([{ selectedProduct: null, ratio: 0, weight: '' }]);
    const note = ''
    const [onPageChange, setOnPageChange] = useState(false);
    const { toast } = useToast();

    const { setBreadcrumb } = useBreadcrumbStore()

    useEffect(() => {
        setBreadcrumb(<ProductionPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);

    useEffect(() => {
        getProducts();
        getIngredients();
    }, []);

    const getProducts = async () => {
        try {
            const url = `/products/`;
            const response = await api.get(url);
            const data = response.data;
            setProducts(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách sản phẩm!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    const getIngredients = async () => {
        setLoadingData(true);
        try {
            const url = `/productwarehouse/getAllIngredients`;
            const response = await api.get(url);
            const data = response.data;
            setIngredients(data.filter((p: any) => p.unit !== '' && p.weightPerUnit > 0));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách nguyên liệu!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    const handleOutputChange = (index: any, field: any, value: any) => {
        const newOutputs = [...outputs];
        newOutputs[index][field] = value;

        if (field === 'ratio' && selectedType) {
            newOutputs[index].weight = parseFloat(((value / 100) * (inputWeight * selectedType.weightPerUnit)).toFixed(2));
        }
        setOutputs(newOutputs);
    };

    useEffect(() => {
        if (selectedType && inputWeight) {
            const updatedOutputs = outputs.map((output: any) => ({
                ...output,
                weight: parseFloat(((output.ratio / 100) * (inputWeight * selectedType.weightPerUnit)).toFixed(2)),
            }));
            setOutputs(updatedOutputs);
        }
    }, [inputWeight]);

    const addOutput = () => {
        setOutputs([...outputs, { selectedProduct: '', ratio: '', weight: '' }]);
    };

    const removeOutput = (index: any) => {
        setOutputs(outputs.filter((_: any, i: any) => i !== index));
    };

    const handleSubmit = async () => {
        setOnPageChange(true)

        if (outputs.length < 1) {
            toast({
                variant: 'destructive',
                title: 'Không thể tạo phiếu!',
                description: 'Danh sách rỗng! Vui lòng thêm thành phẩm!',
                duration: 3000
            })
            setOnPageChange(false)
            return;
        }

        const isValid = outputs && outputs.some((output: any, index: number) => {
            if (output.ratio === 0 || output.weight === "" || output.selectedProduct === null) {
                toast({
                    variant: 'destructive',
                    title: 'Không thể tạo phiếu!',
                    description: `Vui lòng xem lại thành phẩm ở dòng số ${index + 1}!`,
                    duration: 3000
                });
                setOnPageChange(false);
                return true;
            }
            return false;
        });

        if (!isValid) {
            try {
                const response = await api.post(`/productionOrder/createProductionOrder`, {
                    description: note,
                    quantity: inputWeight,
                    username: localStorage.getItem("username"),
                    productWarehouseId: selectedType?.id || 0,
                    finishedProductDtoList: outputs.map((output: any) => {
                        return {
                            productId: output?.selectedProduct?.id,
                            proportion: output?.ratio,
                            quantity: output?.weight
                        }
                    })
                });
                if (response.status >= 200 && response.status < 300) {
                    setOnPageChange(false)
                    toast({
                        variant: 'default',
                        title: 'Tạo phiếu thành công',
                        description: `Phiếu sản xuất đã được tạo thành công`,
                        style: {
                            backgroundColor: '#4caf50',
                            color: '#fff',
                        },
                        duration: 3000
                    })
                    router.push("/production");
                } else {
                    setOnPageChange(false)
                    toast({
                        variant: 'destructive',
                        title: 'Tạo phiếu thất bại',
                        description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                        duration: 3000
                    })
                }
            } catch (error: any) {
                const messages = error?.response?.data?.message || ['Đã xảy ra lỗi, vui lòng thử lại.'];
                toast({
                    variant: 'destructive',
                    title: 'Tạo phiếu thất bại',
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
        }
    };

    useEffect(() => {
        if (!selectedIngredient) {
            setSelectedType(null);
        }
    }, [selectedIngredient])

    return (
        <div>
            <div className='w-full flex my-10 justify-center'>
                <div className='w-full md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    {loadingData ? (
                        <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                    ) : (
                        <div
                            className={`w-[100%] mt-5 text-center lg:mt-10 p-[7px] text-white bg-[#4ba94d]`}
                            style={{ boxShadow: '3px 3px 5px lightgray' }}
                        >
                            <strong>Thông tin phiếu sản xuất</strong>
                        </div>
                    )}

                    <div className='flex flex-col mt-10 lg:flex-row lg:px-10'>
                        {loadingData ? (
                            <div className='flex-1'>
                                <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                    <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                    <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                    <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='flex-1 items-center px-2 w-full'>
                                    <div className='my-5 xl:flex-row flex-col flex w-full xl:space-x-2 xl:space-y-0 space-y-2'>
                                        <div className='flex space-x-2 pr-1 w-fit bg-[#4ba94d] items-center rounded-lg '>
                                            <span className='text-white font-semibold p-2 rounded-lg'>Nguyên liệu: </span>
                                            <Autocomplete
                                                disablePortal
                                                options={products.filter(
                                                    (p) =>
                                                        p.productWarehouses.some(
                                                            (pw: RowData) => pw?.warehouse.id === 1 && pw?.weightPerUnit > 0
                                                        )
                                                )}
                                                value={selectedIngredient}
                                                getOptionLabel={(option) => option?.category?.name + " " + option?.name + ' (' + option?.supplier?.name + ')'}
                                                sx={{
                                                    width: 300,
                                                    "& .MuiInputBase-root": {
                                                        backgroundColor: "white",
                                                        borderRadius: "8px",
                                                        paddingRight: "8px",
                                                    },
                                                }}
                                                onChange={(event, newValue) => { setSelectedIngredient(newValue) }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        placeholder='Chọn nguyên liệu'
                                                        {...params}
                                                        variant="standard"
                                                        sx={{
                                                            "& .MuiInputBase-root": {
                                                                paddingX: "10px",
                                                            },
                                                            "& .MuiInput-underline:before": {
                                                                display: "none",
                                                            },
                                                            "& .MuiInput-underline:after": {
                                                                display: "none",
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {selectedIngredient && (
                                            <div className='flex space-x-2 pr-1 w-fit bg-[#4ba94d] items-center rounded-lg '>
                                                <span className='text-white font-semibold p-2 rounded-lg'>Quy cách: </span>
                                                <Autocomplete
                                                    disablePortal
                                                    options={ingredients.filter((i: RowData) => i.product.id === selectedIngredient.id)}
                                                    value={selectedType}
                                                    getOptionLabel={(option) => option?.unit + ' ' + option?.weightPerUnit + ' kg'}
                                                    sx={{
                                                        width: 200,
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "white",
                                                            borderRadius: "8px",
                                                            paddingRight: "8px",
                                                        },
                                                    }}
                                                    onChange={(event, newValue) => { setSelectedType(newValue) }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder='Chọn quy cách'
                                                            variant="standard"
                                                            sx={{
                                                                "& .MuiInputBase-root": {
                                                                    paddingX: "10px",
                                                                },
                                                                "& .MuiInput-underline:before": {
                                                                    display: "none",
                                                                },
                                                                "& .MuiInput-underline:after": {
                                                                    display: "none",
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className='my-5 flex flex-col lg:flex-row'>
                                        <span className='font-bold lg:pt-5'>Số lượng sản xuất {selectedType && '(' + selectedType?.unit + ')'}:</span>
                                        <TextField
                                            className='lg:ml-5 mt-2 lg:mt-0'
                                            type={'text'}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numericValue = Number(value);
                                                if (!isNaN(numericValue) && Number(value) >= 0) {
                                                    setInputWeight(Number(value));
                                                }
                                            }}
                                            value={inputWeight}
                                            label={`Nhập số lượng ${selectedType ? '(' + selectedType?.unit + ')' : ''}`}
                                            variant="standard" />
                                    </div>
                                    {selectedType && inputWeight && (
                                        <div className='my-5 flex flex-col lg:justify-between lg:flex-row'>
                                            <span className='font-bold lg:pt-5'>Quy đổi thành: {inputWeight * selectedType.weightPerUnit} kg</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className='lg:px-10 mt-5 px-2 w-full'>
                        <p className='font-bold mb-5'>Danh sách thành phẩm :</p>
                        {loadingData ? (
                            <div className="w-full">
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-t-lg' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-2' />
                                <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='rounded-b-lg mt-2' />
                            </div>
                        ) : (
                            <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                    <TableHead className='bg-[#0090d9]'>
                                        <TableRow>
                                            <TableCell>
                                                <p className='font-semibold text-white'>STT</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className='font-semibold text-white'>Tên sản phẩm</p>
                                            </TableCell>
                                            <TableCell className='max-w-[100px] '>
                                                <p className='font-semibold text-white'>Tỉ lệ (%)</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className='font-semibold text-white'>Khối lượng (kg)</p>
                                            </TableCell>
                                            <TableCell align='center'><p className='font-semibold text-white'>Hành động</p></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {outputs.map((output: any, index: any) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className='px-2 py-4'>
                                                    <Autocomplete
                                                        disablePortal
                                                        disableClearable
                                                        options={products.filter(
                                                            (p: any) =>
                                                                p.productWarehouses[0]?.warehouse.id === 2 &&
                                                                !outputs.some((output: any) => output.selectedProduct?.id === p.id)
                                                        )}
                                                        value={output?.selectedProduct || null}
                                                        getOptionLabel={(option) => option?.category?.name + " " + option?.name + " (" + option?.supplier?.name + ")"}
                                                        onChange={(event, newValue) => {
                                                            handleOutputChange(index, 'selectedProduct', newValue)
                                                        }}
                                                        renderInput={(params) => <TextField {...params} variant='standard' />}
                                                    />
                                                </TableCell>
                                                <TableCell className='max-w-[100px] '>
                                                    <TextField
                                                        type={'text'}
                                                        onChange={(e) => {
                                                            const newRatio = Number(e.target.value);
                                                            const updatedRatios = outputs.map((item: any, idx: any) =>
                                                                idx === index ? newRatio : item.ratio
                                                            );
                                                            const total = updatedRatios.reduce((sum: any, r: any) => sum + r, 0);

                                                            if (!isNaN(newRatio) && newRatio >= 0) {
                                                                if (total > 100) {
                                                                    const maxRatio = Math.max(
                                                                        ...outputs.map((item: any, idx: any) => (idx === index ? 0 : item.ratio))
                                                                    );
                                                                    handleOutputChange(index, 'ratio', 100 - maxRatio);
                                                                } else {
                                                                    handleOutputChange(index, 'ratio', newRatio);
                                                                }
                                                            }
                                                        }}
                                                        value={output?.ratio}
                                                        variant="standard" />
                                                </TableCell>
                                                <TableCell>{output?.weight || '0'} kg</TableCell>
                                                <TableCell align='center' className='p-2'>
                                                    <div className='flex justify-center'>
                                                        <div className='relative group'>
                                                            <Trash2 size={18} onClick={() => removeOutput(index)} className='cursor-pointer' />
                                                            <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Xóa
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={5} align='right'>
                                                <Button type='button' onClick={addOutput} className='px-5 py-3 text-[14px] bg-[#0090d9] hover:bg-blue-400'>
                                                    <strong>Thêm sản phẩm</strong>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        )}
                    </div>

                    <div className='w-full flex justify-center align-bottom items-center mt-5 mb-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                            </>
                        ) : (
                            <>
                                <Button onClick={handleSubmit} className='mr-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Thêm</strong>
                                </Button>
                                <Button type='button' onClick={() => {
                                    router.push("/production")
                                    setOnPageChange(true)
                                }} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Hủy</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div >
            </div >
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
        </div >
    );
};

export default Page;
