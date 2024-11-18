/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import PopupDetail from '../popup/popupDetail';
import PopupEdit from '../popup/popupEdit';
import { Paper, Skeleton } from '@mui/material';
import { Eye, PenBox, Trash2 } from 'lucide-react';
import api from "../../api/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface RowData {
    [key: string]: any;
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
    const { toast } = useToast();
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

    const handleDelete = async (row: any) => {
        try {
            await api.delete(`/${tableName}/delete/${row.id}`);
            toast({
                variant: 'default',
                title: 'Xóa thành công',
                description: `${tableName} đã được xóa thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
            handleClose?.(true);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const showAlert = async (row: any) => {
        if (row.status === 'CANCELED') {
            Swal.fire({
                title: 'Xác nhận xóa vĩnh viễn',
                text: `${name} này đã bị hủy trước đó, Nếu tiếp tục xóa thì sẽ không thể khôi phục. Bạn có muốn tiếp tục?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Không, hủy!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(row);
                } else {
                    Swal.fire('Đã hủy', `${name} không bị xóa.`, 'info');
                }
            });
        } else {
            Swal.fire({
                title: 'Xác nhận xóa',
                text: `Bạn có chắc chắn muốn xóa ${name?.toLocaleLowerCase()} này?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Không, hủy!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(row);
                } else {
                    Swal.fire('Đã hủy', `${name} không bị xóa.`, 'info');
                }
            });
        }
    };

    const deleteImportAndExport = (row: any) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa phiếu ${name?.toLocaleLowerCase()} và lô hàng này không, một khi đã xóa sẽ không thể khôi phục nữa.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.delete(`/WarehouseReceipt/delete/${row.id}`);
                    console.log(response);
                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: 'Xóa thành công',
                            description: `Xoá phiếu ${name?.toLocaleLowerCase()} và lô hàng thành công.`,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                            duration: 3000
                        })
                        if (tableName === "import") {
                            router.push("/import")
                        } else {
                            router.push("/export");
                        }
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Xóa thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Xóa thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            } else {
                Swal.fire('Đã hủy', `Lô hàng và phiếu ${tableName} không bị xóa.`, 'info');
            }
        });
    }

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

        if (tableName === 'inventory' && key === 'status') {
            if (cell.toString() === 'PENDING') {
                return 'Đang xử lý'
            } else if (cell.toString() === 'CANCELED') {
                return 'Đã hủy'
            } else if (cell.toString() === 'COMPLETED') {
                return 'Đã xác nhận'
            } else {
                return 'N/A'
            }
        }

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
            if (key.toLocaleLowerCase().includes('price') || key.toLocaleLowerCase().includes('amount')) {
                return formatCurrency(cell);
            }
            if (key === 'active') {
                return cell ? 'Hoạt động' : 'Không hoạt động';
            }
        }
        return cell;
    };

    return (
        <div className='w-full overflow-x-auto'>
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
                <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                        <TableHead className='bg-[#0090d9]'>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index} className='font-semibold text-white'>{column.displayName}</TableCell>
                                ))}
                                <TableCell align='center' className='font-semibold text-white'>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length !== 0 ? (
                                data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex} className={`font-semibold bg-white`}>
                                        {columns.map((column, cellIndex) => (
                                            <TableCell
                                                key={cellIndex}
                                            >
                                                {renderCell(column.name, row)}
                                            </TableCell>
                                        ))}
                                        {tableName !== 'batch' && (
                                            <TableCell className="px-4 py-3">
                                                {tableName !== 'categories' && tableName !== 'expense' && tableName !== 'suppliers' ? (
                                                    <div className="flex justify-center space-x-3">
                                                        {tableName !== "import" && (
                                                            <div className="relative group">
                                                                <button onClick={() => router.push(`/${tableName.toString()}/${row.id}`)}>
                                                                    <Eye size={18} />
                                                                </button>
                                                                <span className="absolute text-center w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Chi tiết
                                                                </span>
                                                            </div>
                                                        )}
                                                        {tableName != "import" && tableName != "inventory" && (
                                                            <div className="relative group">
                                                                <button onClick={() => router.push(`/${tableName.toString()}/update/${row.id}`)}>
                                                                    <PenBox size={18} />
                                                                </button>
                                                                <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Chỉnh sửa
                                                                </span>
                                                            </div>
                                                        )}
                                                        {tableName != "import" && tableName != "export" ? (
                                                            <div className="relative group">
                                                                <button onClick={() => showAlert(row)}>
                                                                    <Trash2 size={18} />
                                                                </button>
                                                                <span className="absolute text-center w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                    Xóa
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            row?.batchProductDtos?.some((item: any) => item.added === true) ? (
                                                                <div className="relative group"></div>
                                                            ) : (
                                                                <div className="relative group">
                                                                    <button onClick={() => deleteImportAndExport(row)}>
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                    <span className="absolute text-center w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                        Xóa
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                ) : (
                                                    <div className="flex justify-center space-x-3">
                                                        <div className="relative group">
                                                            <button onClick={() => openDetailPopup(row)}>
                                                                <Eye size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Chi tiết
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <button onClick={() => openEditPopup(row)}>
                                                                <PenBox size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Chỉnh sửa
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <button onClick={() => showAlert(row)}>
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Xóa
                                                            </span>
                                                        </div>
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
                                            Không có dữ liệu
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {(tableName == 'categories' || tableName == 'suppliers' || tableName == 'expense') && isDetailVisible && selectedRow != null && (
                <PopupDetail tableName={name} titles={titles} data={selectedRow} handleClose={closeDetailPopup} />
            )}
            {(tableName == 'categories' || tableName == 'suppliers' || tableName == 'expense') && isEditVisible && selectedRow != null && (
                <PopupEdit tableName={name} url={editUrl} titles={titles} data={selectedRow} handleClose={closeEditPopup} />
            )}
        </div>
    );
};

export default List;