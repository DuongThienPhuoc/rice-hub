'use client';
import React from 'react';
import editIcon from '@/components/icon/edit.svg'
import deleteIcon from '@/components/icon/delete.svg'
import sortIcon from '@/components/icon/sort.svg'
import Image from "next/image";
import Swal from 'sweetalert2';

interface RowData {
    [key: string]: string | number;
}

interface DataTableProps {
    columns: string[];
    data: RowData[];
}

const List: React.FC<DataTableProps> = ({ columns, data }) => {
    const formatCurrency = (value: number | string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

    const showAlert = () => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa mục này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, hủy!',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Đã xóa!', 'Mục đã được xóa.', 'success');
            } else {
                Swal.fire('Đã hủy', 'Mục không bị xóa.', 'info');
            }
        });
    };

    const handleSort = (column: string) => {
        console.log(`Sorting ${column}`);
    };

    return (
        <div>
            <hr className="border-t-2 border-gray-200" />
            <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                    <tr className="bg-transparent">
                        {columns.map((column, index) => (
                            <th key={index} className="border border-transparent text-[#ACACAC] px-4 py-2">
                                <div className='flex items-center justify-center'>
                                    {column}
                                    {column != '' && (
                                        <button onClick={() => handleSort(column)} className="ml-2">
                                            <Image src={sortIcon} alt="Sort" width={15} height={15} />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white font-semibold">
                            {Object.entries(row).map(([key, cell], cellIndex) => (
                                <td key={cellIndex} className={`text-center border border-transparent ${cellIndex === 0 ? 'rounded-l-lg' : ''} px-7 py-7`}>
                                    {key === 'giaTien' || key === 'giamGia' ? formatCurrency(cell) : cell}
                                </td>
                            ))}
                            <td className="text-center border border-transparent rounded-r-lg px-7 py-7">
                                <button className="mr-8 group">
                                    <Image src={editIcon} alt='edit icon' width={17} height={17} />
                                </button>
                                <button onClick={showAlert}>
                                    <Image src={deleteIcon} alt='delete icon' width={17} height={17} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default List;