/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
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
import { Calendar, DollarSign, Eye, PenBox, RotateCw, Trash2 } from 'lucide-react';
import api from "@/config/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import LinearIndeterminate from '../ui/LinearIndeterminate';

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
    const [onPageChange, setOnPageChange] = useState(false);
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
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const rawRole = localStorage.getItem('role');
        if (rawRole) {
            setRole(rawRole);
        }
    }, []);

    const handleDelete = async (row: any) => {
        setOnPageChange(true);
        try {
            if (tableName === 'ingredients') {
                await api.delete(`/products/delete/${row.id}`);
            } else if (tableName === 'customers') {
                await api.delete(`/customer/delete/${row.id}`);
            } else {
                await api.delete(`/${tableName}/delete/${row.id}`);
            }
            setOnPageChange(false);
            toast({
                variant: 'default',
                title: 'Xóa thành công',
                description: `${name} đã được xóa thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
            handleClose?.(true);
        } catch (error: any) {
            setOnPageChange(false);
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const handlePaySupplier = async (row: any) => {
        Swal.fire({
            title: 'Xác nhận xuất phiếu chi',
            text: `Một khi đã xuất phiếu chi thì sẽ không thể thay đổi. Bạn có muốn tiếp tục?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xuất!',
            cancelButtonText: 'Không',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setOnPageChange(true);
                try {
                    await api.post(`/ExpenseVoucher/paySupplier/${row.id}`);
                    setOnPageChange(false);
                    toast({
                        variant: 'default',
                        title: 'Xuất phiếu thành công',
                        description: `Phiếu chi đã được xuất thành công`,
                        style: {
                            backgroundColor: '#4caf50',
                            color: '#fff',
                        },
                        duration: 3000
                    })
                    handleClose?.(true);
                } catch (error: any) {
                    setOnPageChange(false);
                    toast({
                        variant: 'destructive',
                        title: 'Xuất phiếu thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            }
        });
    }

    const handleEnable = async (row: any) => {
        setOnPageChange(true);
        try {
            if (tableName === 'ingredients') {
                await api.post(`/products/enable/${row.id}`);
            } else if (tableName === 'customers') {
                await api.post(`/customer/enable/${row.id}`);
            } else {
                await api.post(`/${tableName}/enable/${row.id}`);
            }
            toast({
                variant: 'default',
                title: 'Khôi phục thành công',
                description: `${name} đã được khôi phục thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
            setOnPageChange(false);
            handleClose?.(true);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Khôi phục thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            setOnPageChange(false);
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
                cancelButtonText: 'Không',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(row);
                }
            });
        } else {
            Swal.fire({
                title: 'Xác nhận xóa',
                text: `Bạn có chắc chắn muốn xóa ${name?.toLocaleLowerCase()} này?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Không',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(row);
                }
            });
        }
    };

    const enable = async (row: any) => {
        Swal.fire({
            title: 'Xác nhận khôi phục',
            text: `Bạn có chắc chắn muốn khôi phục ${name?.toLocaleLowerCase()} này?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, khôi phục!',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                handleEnable(row);
            }
        });
    };

    const deleteImportAndExport = (row: any) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa ${name?.toLocaleLowerCase()} và lô hàng này không, một khi đã xóa sẽ không thể khôi phục nữa.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setOnPageChange(true);
                    const response = await api.delete(`/WarehouseReceipt/delete/${row.id}`);
                    if (response.status >= 200 && response.status < 300) {
                        setOnPageChange(false);
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
                        handleClose?.(true);
                    } else {
                        setOnPageChange(false);
                        toast({
                            variant: 'destructive',
                            title: 'Xóa thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    setOnPageChange(false);
                    toast({
                        variant: 'destructive',
                        title: 'Xóa thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
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

        if (tableName === 'import' && key === 'batchCode') {
            if (row.batchCode === null) {
                return (
                    <a
                        className="text-blue-500 font-semibold hover:text-blue-300 cursor-pointer"
                        onClick={() => {
                            router.push(`/admin/orders/${row?.orderId.toString()}`)
                            setOnPageChange(true)
                        }}>
                        {row?.orderCode.toString()}
                    </a>
                );
            } else {
                return (
                    <a
                        className="text-blue-500 font-semibold hover:text-blue-300 cursor-pointer"
                        onClick={() => {
                            router.push(`/batches/${cell.toString()}`)
                            setOnPageChange(true)
                        }}
                    >
                        {cell.toString()}
                    </a>
                );
            }
        }

        if (cell === undefined || cell === null) return '';

        if (tableName === 'inventory' && key === 'status') {
            if (cell.toString() === 'PENDING') {
                return 'Đang chờ xác nhận'
            } else if (cell.toString() === 'CANCELED') {
                return 'Đã hủy'
            } else if (cell.toString() === 'COMPLETED') {
                return 'Đã xác nhận'
            } else if (cell.toString() === 'IN_PROCESS') {
                return 'Đang xử lý'
            } else {
                return 'N/A'
            }
        }

        if (tableName === 'production' && key === 'status') {
            if (cell.toString() === 'PENDING') {
                return 'Đang chờ xác nhận'
            } else if (cell.toString() === 'CANCELED') {
                return 'Đã hủy'
            } else if (cell.toString() === 'COMPLETED') {
                return 'Sản xuất xong'
            } else if (cell.toString() === 'IN_PROCESS') {
                return 'Đang sản xuất'
            } else if (cell.toString() === 'CONFIRMED') {
                return 'Hoàn thành'
            } else {
                return 'N/A'
            }
        }

        if (key === 'role.employeeRole.roleName') {
            if (cell.toString() === 'DRIVER') {
                return 'Nhân viên giao hàng'
            } else if (cell.toString() === 'PORTER') {
                return 'Nhân viên bốc/dỡ hàng'
            } else if (cell.toString() === 'WAREHOUSE_MANAGER') {
                return 'Nhân viên quản kho'
            } else {
                return 'N/A'
            }
        }

        if (key.includes('batchCode')) {
            return (
                <a
                    className="text-blue-500 font-semibold hover:text-blue-300 cursor-pointer"
                    onClick={() => {
                        router.push(`/batches/${cell.toString()}`)
                        setOnPageChange(true)
                    }}
                >
                    {cell.toString()}
                </a>
            );
        }

        if ((key.includes('Date') || key.includes('At') || key.includes('at') || key.includes('date')) && (Date.parse(cell.toString()))) {
            const date = new Date(cell.toString());
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return (
                <div className='flex space-x-2'>
                    <Calendar size={16} color='gray' />
                    <p>
                        {`${day}/${month}/${year}`}
                    </p>
                </div>
            );
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
                return cell ? 'Hoạt động' : 'Ngưng hoạt động';
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
                                    <TableCell key={index}><p className='font-semibold text-white'>{column.displayName}</p></TableCell>
                                ))}
                                <TableCell align='center'><p className='font-semibold text-white'>Hành động</p></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length !== 0 ? (
                                data.map((row, rowIndex) => (
                                    ((tableName === 'products' || tableName === 'ingredients') ? row?.active === false : row?.active === true) ? (
                                        <TableRow key={rowIndex} className={`font-semibold bg-white`}>
                                            {columns.map((column, cellIndex) => (
                                                <TableCell
                                                    className='max-w-[200px]'
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
                                                                    <button onClick={() => {
                                                                        router.push(`/${tableName.toString()}/${row.id}`)
                                                                        setOnPageChange(true);
                                                                    }}>
                                                                        <Eye size={18} />
                                                                    </button>
                                                                    <span className="absolute text-center w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                        Chi tiết
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {tableName != "import" && tableName != "inventory" && (
                                                                tableName === 'production' && row.status !== 'PENDING' ? (
                                                                    <></>
                                                                ) : (
                                                                    <div className="relative group">
                                                                        <button onClick={() => {
                                                                            router.push(`/${tableName.toString()}/update/${row.id}`)
                                                                            setOnPageChange(true);
                                                                        }}>
                                                                            <PenBox size={18} />
                                                                        </button>
                                                                        <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                            Chỉnh sửa
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                            {tableName != "import" && tableName != "export" ? (
                                                                tableName === 'production' && row.status !== 'PENDING' ? (
                                                                    <></>
                                                                ) : (
                                                                    tableName !== 'customers' && (
                                                                        <div className="relative group">
                                                                            <button onClick={() => showAlert(row)}>
                                                                                <Trash2 size={18} />
                                                                            </button>
                                                                            <span className="absolute text-center w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Xóa
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                row?.batchProductDtos?.some((item: any) => item.isAdded === true) ? (
                                                                    <div className="relative group">
                                                                        {tableName === 'import' && row?.isPay === false && role === 'ROLE_ADMIN' ? (
                                                                            <>
                                                                                <button onClick={() => handlePaySupplier(row)}>
                                                                                    <DollarSign size={18} />
                                                                                </button>
                                                                                <span className="absolute text-center w-[100px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                    Xuất phiếu chi
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <></>
                                                                        )}

                                                                    </div>
                                                                ) : (
                                                                    (tableName === 'import' && row.orderCode ? (
                                                                        <></>
                                                                    ) : (
                                                                        <div className="relative group">
                                                                            <button onClick={() => deleteImportAndExport(row)}>
                                                                                <Trash2 size={18} />
                                                                            </button>
                                                                            <span className="absolute text-center w-[50px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                Xóa
                                                                            </span>
                                                                        </div>
                                                                    ))
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
                                    ) : (
                                        tableName !== 'categories' && tableName !== 'expense' && tableName !== 'import' && tableName !== 'suppliers' ? (

                                            <TableRow key={rowIndex}>
                                                {columns.map((column, cellIndex) => (
                                                    <TableCell className='opacity-40 pointer-events-none' key={cellIndex}>
                                                        {renderCell(column.name, row)}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
                                                    <div className="flex justify-center space-x-3">
                                                        <div className="relative group">
                                                            <button onClick={() => {
                                                                router.push(`/${tableName.toString()}/${row.id}`)
                                                                setOnPageChange(true);
                                                            }}>
                                                                <Eye size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Chi tiết
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <button onClick={() => {
                                                                router.push(`/${tableName.toString()}/update/${row.id}`)
                                                                setOnPageChange(true);
                                                            }}>
                                                                <PenBox size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Chỉnh sửa
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <button onClick={() => enable(row)}>
                                                                <RotateCw size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Khôi phục
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow key={rowIndex}>
                                                {columns.map((column, cellIndex) => (
                                                    <TableCell className='opacity-40 pointer-events-none' key={cellIndex}>
                                                        {renderCell(column.name, row)}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
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
                                                            <button onClick={() => enable(row)}>
                                                                <RotateCw size={18} />
                                                            </button>
                                                            <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                Khôi phục
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1}>
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
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0 left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;