/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import editIcon from '@/components/icon/edit.svg'
import deleteIcon from '@/components/icon/delete.svg'
import sortIcon from '@/components/icon/sort.svg'
import eyeIcon from '@/components/icon/eye_icon.svg'
import Image from "next/image";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { LinearProgress } from '@mui/material';
import PopupDetail from '../popup/popupDetail';
import PopupEdit from '../popup/popupEdit';

interface RowData {
    [key: string]: string | number | boolean;
}

interface DataTableProps {
    name: string;
    editUrl: string;
    titles: {
        name: string;
        displayName: string;
        type: string;
    }[];
    columns: {
        name: string;
        displayName: string;
    }[];
    data: RowData[];
    tableName: string;
    handleClose?: (reload?: boolean) => void;
}

const List: React.FC<DataTableProps> = ({ name, editUrl, titles, columns, data, tableName, handleClose }) => {
    const formatCurrency = (value: number | string | boolean) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

    const router = useRouter();
    const [isDetailVisible, setDetailVisible] = useState(false);
    const [isEditVisible, setEditVisible] = useState(false);
    const openDetailPopup = (row: RowData) => {
        setSelectedRow(row);
        setDetailVisible(true);
    };

    const closeDetailPopup = () => {
        setDetailVisible(false);
        setSelectedRow(null);
    };

    const openEditPopup = (row: RowData) => {
        setSelectedRow(row);
        setEditVisible(true);
    };

    const closeEditPopup = (reload?: boolean) => {
        setEditVisible(false);
        setSelectedRow(null);
        if (reload == true && handleClose) {
            handleClose(true);
        }
    };

    const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

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

    const renderCell = (key: any, cell: any) => {
        if (key === 'joinDate' || key === 'createDate' && Date.parse(cell)) {
            const date = new Date(cell);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        if (typeof cell === 'object' && cell !== null) {
            if (key === 'salaryDetail') {
                return `${cell.baseSalary} (Bonus: ${cell.bonus})`;
            }
            return JSON.stringify(cell);
        } else {
            if (key === 'giaTien' || key === 'giamGia') {
                return formatCurrency(cell);
            }
            if (key === 'active') {
                return cell ? 'Hoạt động' : 'Không hoạt động';
            }
        }

        return cell;
    };

    return (
        <div className='w-full'>
            <table className="min-w-[1242.99px] w-full bg-white border-collapse">
                <thead>
                    <tr className="bg-[#e6f1fe]">
                        {columns.map((column, index) => (
                            <th key={index} className="border border-transparent bg-[#e6f1fe] text-black px-2 py-2">
                                <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                    {column.displayName}
                                    {column.displayName && (
                                        <button onClick={() => handleSort(column.displayName)} className="ml-2">
                                            <Image src={sortIcon} className='min-w-[15px] min-h-[15px]' alt="Sort" width={15} height={15} />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                        <th className="border border-transparent bg-[#e6f1fe] text-black px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length !== 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className={`font-semibold border border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                {columns.map((column, cellIndex) => (
                                    <td key={cellIndex} className='text-center px-4 py-3'>
                                        {renderCell(column.name, row[column.name])}
                                    </td>
                                ))}
                                <td className="text-center px-4 py-3">
                                    {tableName !== 'categories' && tableName !== 'suppliers' ? (
                                        <div className="flex justify-center space-x-3">
                                            <button onClick={() => router.push(`/${tableName.toString()}/${row.id}`)} className="group w-6 h-6 md:w-auto md:h-auto">
                                                <Image src={eyeIcon} alt="view icon" width={16} height={16} className="min-w-[16px] min-h-[16px]" />
                                            </button>
                                            <button onClick={() => router.push(`/${tableName.toString()}/update/${row.id}`)} className="group w-6 h-6 md:w-auto md:h-auto">
                                                <Image src={editIcon} alt="edit icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                            </button>
                                            <button onClick={showAlert} className="group w-6 h-6 md:w-auto md:h-auto">
                                                <Image src={deleteIcon} alt="delete icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center space-x-3">
                                            <button onClick={() => openDetailPopup(row)} className="group w-6 h-6 md:w-auto md:h-auto">
                                                <Image src={eyeIcon} alt="view icon" width={16} height={16} className="min-w-[16px] min-h-[16px]" />
                                            </button>
                                            <button onClick={() => openEditPopup(row)} className="group w-6 h-6 md:w-auto md:h-auto">
                                                <Image src={editIcon} alt="edit icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                            </button>
                                            <button onClick={showAlert} className="group w-6 h-6 md:w-auto md:h-auto">
                                                <Image src={deleteIcon} alt="delete icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                            </button>
                                        </div>
                                    )}
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
            {(tableName == 'categories' || tableName == 'suppliers') && isDetailVisible && selectedRow != null && (
                <PopupDetail tableName={name} titles={titles} data={selectedRow} handleClose={closeDetailPopup} />
            )}
            {(tableName == 'categories' || tableName == 'suppliers') && isEditVisible && selectedRow != null && (
                <PopupEdit tableName={name} url={editUrl} titles={titles} data={selectedRow} handleClose={closeEditPopup} />
            )}
        </div>
    );
};

export default List;