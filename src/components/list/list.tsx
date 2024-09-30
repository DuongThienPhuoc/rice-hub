'use client';
import React from 'react';
import editIcon from '@/components/icon/edit.svg'
import deleteIcon from '@/components/icon/delete.svg'
import sortIcon from '@/components/icon/sort.svg'
import eyeIcon from '@/components/icon/eye_icon.svg'
import Image from "next/image";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

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

    const router = useRouter();

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
            <table className="min-w-[1242.99px] bg-white border-collapse">
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
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={`font-semibold border border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>
                            {Object.entries(row).map(([key, cell], cellIndex) => (
                                <td key={cellIndex} className={`text-center px-4 py-3`}>
                                    {key === 'giaTien' || key === 'giamGia' ? formatCurrency(cell) : cell}
                                </td>
                            ))}
                            <td className="text-center px-4 py-3">
                                <div className="flex justify-center space-x-3">
                                    <button onClick={() => router.push(`/products/${row.ma}`)} className="group w-6 h-6 md:w-auto md:h-auto">
                                        <Image src={eyeIcon} alt="view icon" width={16} height={16} className="min-w-[16px] min-h-[16px]" />
                                    </button>
                                    <button onClick={() => router.push(`/products/update/${row.ma}`)} className="group w-6 h-6 md:w-auto md:h-auto">
                                        <Image src={editIcon} alt="edit icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                    </button>
                                    <button onClick={showAlert} className="group w-6 h-6 md:w-auto md:h-auto">
                                        <Image src={deleteIcon} alt="delete icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default List;