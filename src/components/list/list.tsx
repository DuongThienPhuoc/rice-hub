/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import editIcon from '@/components/icon/edit.svg'
import deleteIcon from '@/components/icon/delete.svg'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'; import eyeIcon from '@/components/icon/eye_icon.svg'
import Image from "next/image";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import PopupDetail from '../popup/popupDetail';
import PopupEdit from '../popup/popupEdit';
import { Paper, Skeleton } from '@mui/material';

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
    loadingData: boolean;
    handleClose?: (reload?: boolean) => void;
}

const List: React.FC<DataTableProps> = ({ name, editUrl, titles, columns, data, tableName, loadingData, handleClose }) => {
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

    // const handleSort = (column: string) => {
    //     console.log(`Sorting ${column}`);
    // };

    type RowData = {
        [key: string]: any;
    };

    const renderCell = (key: string, row: RowData) => {
        const keys = key.split('.');
        let cell = row;

        keys.forEach(k => {
            cell = cell?.[k];
        });

        if (cell === undefined || cell === null) return '';

        if (key.includes('batchCode')) {
            return (
                <a
                    className="text-blue-500 font-semibold hover:text-blue-300 cursor-pointer"
                    onClick={() => router.push(`/batches/${cell.toString()}`)}
                >
                    {cell.toString()}
                </a>
            );
        }

        if ((key.includes('Date') || key.includes('date')) && Date.parse(cell.toString())) {
            const date = new Date(cell.toString());
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
            if (key.includes('price')) {
                return formatCurrency(cell);
            }
            if (key === 'active') {
                return cell ? 'Hoạt động' : 'Không hoạt động';
            }
        }
        return cell;
    };

    return (
        <div className='w-full mb-20 rounded-2xl overflow-x-auto'>
            {loadingData ? (
                <div className="w-full">
                    <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                    {Array.from({ length: 10 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex mt-2">
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                        </div>
                    ))}
                </div>
            ) : (
                <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 5, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 900, borderCollapse: 'collapse' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index} align='center' className='font-semibold'>{column.displayName}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length !== 0 ? (
                                data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex} className={`font-semibold border border-gray-200 bg-white`}>
                                        {columns.map((column, cellIndex) => (
                                            <TableCell
                                                align='center'
                                                key={cellIndex}
                                            >
                                                {renderCell(column.name, row)}
                                            </TableCell>
                                        ))}
                                        {tableName !== 'batch' && (
                                            <TableCell className="text-center px-4 py-3">
                                                {tableName !== 'categories' && tableName !== 'suppliers' ? (
                                                    <div className="flex justify-center space-x-3">
                                                        {tableName !== "import" && (
                                                            <button onClick={() => router.push(`/${tableName.toString()}/${row.id}`)} className="group w-6 h-6 md:w-auto md:h-auto">
                                                                <Image src={eyeIcon} alt="view icon" width={16} height={16} className="min-w-[16px] min-h-[16px]" />
                                                            </button>
                                                        )}
                                                        {tableName != "import" && (
                                                            <button onClick={() => router.push(`/${tableName.toString()}/update/${row.id}`)} className="group w-6 h-6 md:w-auto md:h-auto">
                                                                <Image src={editIcon} alt="edit icon" width={14} height={14} className="min-w-[14px] min-h-[14px]" />
                                                            </button>
                                                        )}
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
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <div className="my-10 mx-4 text-center text-gray-500">
                                            Không tìm thấy dữ liệu
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
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