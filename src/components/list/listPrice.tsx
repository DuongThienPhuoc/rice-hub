'use client';
import React, { useState } from 'react';
import sortIcon from '@/components/icon/sort.svg'
import Image from "next/image";
import { LinearProgress } from '@mui/material';

interface RowData {
    [key: string]: string | number;
}

interface DataTableProps {
    columns: string[];
    data: RowData[];
}

const ListPrice: React.FC<DataTableProps> = ({ columns, data }) => {
    const formatCurrency = (value: number | string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

    const handleSort = (column: string) => {
        console.log(`Sorting ${column}`);
    };

    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
    const [editedValues, setEditedValues] = useState<{ [key: string]: string | number }>({});

    const handleEditClick = (rowIndex: number, value: string | number) => {
        setEditingRowIndex(rowIndex);
        setEditedValues((prev) => ({ ...prev, giaTien: value }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEditedValues((prev) => ({ ...prev, giaTien: value }));
    };

    const handleSave = (rowIndex: number) => {
        setEditingRowIndex(null);
        console.log(rowIndex);
    };

    const handleCancel = (rowIndex: number) => {
        setEditingRowIndex(null);
        console.log(rowIndex);
    };

    return (
        <div className='w-full'>
            <table className="w-full bg-white border-collapse">
                <thead>
                    <tr className="bg-[#e6f1fe]">
                        {columns.map((column, index) => (
                            <th key={index} className="border border-transparent bg-[#e6f1fe] text-black px-2 py-2">
                                <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                    {column}
                                    {column != '' && (
                                        <button onClick={() => handleSort(column)} className="ml-2">
                                            <Image src={sortIcon} className='min-w-[15px] min-h-[15px]' alt="Sort" width={15} height={15} />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                        <th className="border border-transparent bg-[#e6f1fe] text-black px-2 py-2">#</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length !== 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className={`font-semibold border border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                {Object.entries(row).map(([key, cell], cellIndex) => (
                                    <td key={cellIndex} className={`text-center px-4 py-3`}>
                                        {key === 'giaTien' && editingRowIndex === rowIndex ? (
                                            <input
                                                type="text"
                                                value={editedValues.giaTien}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-gray-300 text-center w-[100px] focus:border-b-2 focus:border-gray-500 focus:outline-none"
                                            />
                                        ) : (
                                            key === 'giaTien' ? formatCurrency(cell) : cell
                                        )}                                    </td>
                                ))}
                                <td className="text-center px-4 py-3">
                                    <div className="flex min-w-[100px] justify-center space-x-3">
                                        {editingRowIndex === rowIndex ? (
                                            <>
                                                <button onClick={() => handleSave(rowIndex)} className="group w-6 h-6 md:w-auto md:h-auto hover:text-green-500">
                                                    Lưu
                                                </button>
                                                <span className='px-1'>|</span>
                                                <button onClick={() => handleCancel(rowIndex)} className="group w-6 h-6 md:w-auto md:h-auto hover:text-red-500">
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEditClick(rowIndex, row.giaTien)} className="group w-12 h-6 md:w-auto md:h-auto hover:text-blue-500">
                                                Sửa
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>
                                <div className="my-4 mx-4">
                                    <LinearProgress color="inherit" />
                                </div>
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>
    );
};

export default ListPrice;