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

interface RowData {
    [key: string]: any;
}

const Page = () => {
    const router = useRouter();
    const [ingredients, setIngredients] = useState<RowData[]>([]);
    const [products, setProducts] = useState<RowData[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<RowData | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [inputWeight, setInputWeight] = useState<any>('');
    const [outputs, setOutputs] = useState<any>([{ selectedProduct: null, ratio: 0, weight: '' }]);
    const [note, setNote] = useState<any>('');

    useEffect(() => {
        getProducts();
        getIngredients();
    }, []);

    const getProducts = async () => {
        try {
            const url = `/productwarehouse/getAllProducts`;
            const response = await api.get(url);
            const data = response.data;
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const getIngredients = async () => {
        try {
            const url = `/productwarehouse/getAllIngredients`;
            const response = await api.get(url);
            const data = response.data;
            setIngredients(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleOutputChange = (index: any, field: any, value: any) => {
        const newOutputs = [...outputs];
        newOutputs[index][field] = value;

        if (field === 'ratio') {
            newOutputs[index].weight = ((value / 100) * inputWeight).toFixed(2);
        }
        setOutputs(newOutputs);
    };

    useEffect(() => {
        const updatedOutputs = outputs.map((output: any) => ({
            ...output,
            weight: ((output.ratio / 100) * inputWeight).toFixed(2),
        }));

        setOutputs(updatedOutputs);
    }, [inputWeight]);

    const addOutput = () => {
        setOutputs([...outputs, { selectedProduct: '', ratio: '', weight: '' }]);
    };

    const removeOutput = (index: any) => {
        setOutputs(outputs.filter((_: any, i: any) => i !== index));
    };

    const handleSubmit = async () => {
        if (outputs.length < 1) {
            alert("Danh sách rỗng! Vui lòng thêm sản phẩm.");
            return;
        }

        outputs.map((output: any, index: any) => {
            if (output.selectedProduct === '' || output.ratio === '' || output.ratio === 0 || output.weight === '' || output.weight === 0) {
                alert(`Thông tin của sản phẩm thứ ${index + 1} không hợp lệ!`);
                return;
            }
        });

        try {
            const response = await api.post(`/productuctionOrder/createProductionOrder`, {

            });
            if (response.status >= 200 && response.status < 300) {
                alert(`Lô hàng đã được thêm thành công`);
                router.push("/import");
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };

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
                                <div className='flex-1 items-center'>
                                    <div className='lg:m-10 mx-10 flex lg:justify-between flex-col lg:flex-row'>
                                        <span className='font-bold lg:pt-5'>Chọn nguyên liệu: </span>
                                        <Autocomplete
                                            className='lg:ml-5 mt-2 lg:mt-0'
                                            disablePortal
                                            options={ingredients}
                                            value={selectedIngredient}
                                            getOptionLabel={(option) => option?.product?.name + ' (' + option?.unit + ' ' + option?.weightPerUnit + ' kg)'}
                                            sx={{ minWidth: 300 }}
                                            onChange={(event, newValue) => { setSelectedIngredient(newValue) }}
                                            renderInput={(params) => <TextField {...params} variant='standard' label="Tìm kiếm nguyên liệu" />}
                                        />
                                    </div>

                                    <div className='m-10 flex flex-col lg:justify-between lg:flex-row'>
                                        <span className='font-bold lg:pt-5'>Nhập khối lượng đầu vào (tấn):</span>
                                        <TextField
                                            className='lg:ml-5 mt-2 lg:mt-0'
                                            type={'number'}
                                            onChange={(e) => {
                                                if (Number(e.target.value) >= 0) {
                                                    setInputWeight(e.target.value);
                                                }
                                            }}
                                            value={inputWeight}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            label={'Khối lượng (tấn)'}
                                            variant="standard" />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold lg:pt-5 w-[80px]'>Ghi chú: </span>
                                        <TextField
                                            className='lg:ml-10 mt-2 lg:mt-0 w-full lg:min-w-[80%]'
                                            onChange={(e) => setNote(e.target.value)}
                                            value={note}
                                            multiline
                                            rows={4}
                                            label={'Mô tả'} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='lg:px-10 mt-5 px-2 w-full'>
                        <p className='font-bold mb-5'>Sản phẩm đầu ra :</p>
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
                                                <p className='font-semibold text-white'>Khối lượng (tấn)</p>
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
                                                        options={products}
                                                        value={output?.selectedProduct || null}
                                                        getOptionLabel={(option) => option?.product?.name + ' (' + option?.unit + ' ' + option?.weightPerUnit + ' kg)'}
                                                        onChange={(event, newValue) => {
                                                            handleOutputChange(index, 'selectedProduct', newValue)
                                                        }}
                                                        renderInput={(params) => <TextField {...params} variant='standard' label="Chọn sản phẩm" />}
                                                    />
                                                </TableCell>
                                                <TableCell className='max-w-[100px] '>
                                                    <TextField
                                                        type={'number'}
                                                        onChange={(e) => {
                                                            const newRatio = Number(e.target.value);
                                                            const updatedRatios = outputs.map((item: any, idx: any) =>
                                                                idx === index ? newRatio : item.ratio
                                                            );
                                                            const total = updatedRatios.reduce((sum: any, r: any) => sum + r, 0);
                                                            if (newRatio >= 0 && newRatio <= 100 && total <= 100) {
                                                                handleOutputChange(index, 'ratio', newRatio);
                                                            } else {
                                                                alert('Tổng của tất cả tỉ lệ không được vượt quá 100');
                                                            }
                                                        }}
                                                        value={output?.ratio}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        label={'Tỉ lệ'}
                                                        variant="standard" />
                                                </TableCell>
                                                <TableCell>{output?.weight || '0'} tấn</TableCell>
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
                                <Button type='button' onClick={() => router.push("/import")} className='ml-2 px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Hủy</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
};

export default Page;
