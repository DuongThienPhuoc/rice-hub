/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import api from "@/config/axiosConfig";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getActiveDay } from '@/data/employee';
import { DayActive } from '@/type/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';

type MonthlyEmployeeDialogProps = {
    isOpen: boolean;
    onClose: (value: boolean) => void;
    employeeId: number;
    month: number;
    year: number;
};
export default function MonthlyEmployeeDialog({
    isOpen,
    onClose,
    employeeId,
    month,
    year,
}: MonthlyEmployeeDialogProps) {
    const [dayActive, setDayActive] = React.useState<DayActive[]>([]);
    const router = useRouter();
    async function getMonthlyEmployeeActiveDay() {
        try {
            const response = await getActiveDay(employeeId, month + 1, year);

            const updatedData = response.data.map((item: DayActive) => ({
                ...item,
                amountByTons: item.amountByTons !== undefined && item.amountByTons !== 0
                    ? item.amountByTons
                    : 12000,
            }));

            setDayActive(updatedData);
        } catch (e) {
            console.error("Error fetching data:", e);
            throw e;
        }
    }

    const [selectedDayActive, setSelectedDayActive] = React.useState<any>([]);
    const hasUnaddedDayActive = dayActive.some((day) => !day.spend);
    const [totalAmount, setTotalAmount] = React.useState<any>(0);
    const { toast } = useToast();
    const [onPageChange, setOnPageChange] = React.useState(false);

    const handleSubmit = async () => {
        setOnPageChange(true);
        const formattedData = selectedDayActive.map((day: any) => ({
            dayActiveId: day.id,
            amountByTon: day.amountByTons,
        }));
        try {
            const response = await api.post(`/ExpenseVoucher/payEmployeeSalaryByDate`, formattedData);
            if (response.status >= 200 && response.status < 300) {
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
                router.push("/expenditures");
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Xuất phiếu thất bại',
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
                title: 'Xuất phiếu thất bại',
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
    }

    const handleFieldChange = (field: any, value: string | number | boolean, index: number) => {
        setDayActive((prevData: any) => {
            return prevData.map((item: any, i: any) => {
                if (i === index) {
                    return {
                        ...item,
                        [field]: value,
                    };
                }
                return item;
            });
        });
    };

    React.useEffect(() => {
        getMonthlyEmployeeActiveDay().catch((e) =>
            console.error(`Error: ${e}`),
        );
    }, [employeeId]);

    const handleSelectDayActive = (id: any) => {
        setSelectedDayActive((prevSelected: any) =>
            prevSelected.includes(id)
                ? prevSelected.filter((code: any) => code !== id)
                : [...prevSelected, id]
        );
    };

    React.useEffect(() => {
        if (selectedDayActive.length > 0) {
            setTotalAmount(calculateTotal);
        } else {
            setTotalAmount(0);
        }
    }, [selectedDayActive, dayActive])

    const calculateTotal = () => {
        const total = selectedDayActive.reduce((sum: number, item: any) => {
            return sum + item.mass * item.amountByTons;
        }, 0);

        return total;
    };

    const capitalizeFirstLetter = (str: string): string => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const numberToWords = (num: number): string => {
        if (num === 0) return 'không';

        const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
        const scales = ['', 'nghìn', 'triệu', 'tỷ'];

        const readBlock = (n: number): string => {
            let str = '';
            const hundred = Math.floor(n / 100);
            const ten = Math.floor((n % 100) / 10);
            const unit = n % 10;

            if (hundred) str += units[hundred] + ' trăm ';
            if (ten > 1) {
                str += tens[ten] + ' ';
                if (unit) str += units[unit];
            } else if (ten === 1) {
                str += 'mười ';
                if (unit) str += (unit === 5 ? 'lăm' : units[unit]);
            } else if (unit) {
                str += units[unit];
            }

            return str.trim();
        };

        const splitNumber = (n: number): number[] => {
            const parts = [];
            while (n > 0) {
                parts.push(n % 1000);
                n = Math.floor(n / 1000);
            }
            return parts.reverse();
        };

        const parts = splitNumber(num);
        let result = '';

        for (let i = 0; i < parts.length; i++) {
            const block = parts[i];
            if (block > 0) {
                result += readBlock(block) + ' ' + scales[parts.length - 1 - i] + ' ';
            }
        }

        return result.trim();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[80vw] bg-white">
                <DialogHeader>
                    <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Phiếu chi
                    </DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về phiếu chi
                    </DialogDescription>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                        <TableHead className='bg-[#0090d9]'>
                            <TableRow>
                                <TableCell>
                                    {hasUnaddedDayActive && (
                                        <Checkbox
                                            sx={{
                                                color: 'white',
                                                '&.Mui-checked': {
                                                    color: 'white',
                                                },
                                                '&.MuiCheckbox-indeterminate': {
                                                    color: 'white',
                                                },
                                            }}
                                            indeterminate={selectedDayActive.length > 0 && selectedDayActive.length < dayActive.filter((day) => !day.spend).length}
                                            checked={selectedDayActive.length === dayActive.filter((day) => !day.spend).length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDayActive(dayActive.filter((day) => day.spend === false && day.amountByTons > 0));
                                                } else {
                                                    setSelectedDayActive([]);
                                                }
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell><p className='text-white font-semibold'>Ngày đi làm</p></TableCell>
                                <TableCell><p className='text-white font-semibold'>Năng suất làm việc (Tấn)</p></TableCell>
                                <TableCell><p className='text-white font-semibold'>Số tiền mỗi tấn</p></TableCell>
                                <TableCell><p className='text-white font-semibold'>Trạng thái</p></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dayActive.map((day, index) => (
                                <TableRow key={day.id}>
                                    <TableCell>
                                        {day.spend === false && (
                                            <Checkbox
                                                checked={selectedDayActive.includes(day)}
                                                onChange={() => {
                                                    if (day.amountByTons > 0) {
                                                        handleSelectDayActive(day)
                                                    } else {
                                                        toast({
                                                            variant: 'destructive',
                                                            title: 'Số tiền không hợp lệ!',
                                                            description: 'Vui lòng nhập số tiền lớn hơn 0',
                                                            duration: 3000,
                                                        });
                                                    }
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            day.dayActive,
                                        ).toLocaleDateString('en-US')}
                                    </TableCell>
                                    <TableCell>{day.mass}</TableCell>
                                    <TableCell>
                                        {day.spend === true ? `${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(day.amountPerMass) || 0)}` : (
                                            <Input type="number" value={day.amountByTons || ''}
                                                disabled={selectedDayActive.some((selected: DayActive) => selected.id === day.id)}
                                                onChange={(e) => {
                                                    if (Number(e.target.value) >= 0) {
                                                        handleFieldChange("amountByTons", e.target.value, index)
                                                    }
                                                }} />
                                        )}
                                    </TableCell>
                                    {day.spend === false ? (
                                        <TableCell>
                                            <p className='text-red-500'>Chưa xuất phiếu chi</p>
                                        </TableCell>
                                    ) : (
                                        <TableCell>
                                            <p className="text-green-500">Đã xuất phiếu chi</p>
                                        </TableCell>
                                    )}

                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} className='space-y-2'>
                                    <p className='font-bold text-[20px] text-black'>Tổng tiền (Bằng số): {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(totalAmount) || 0)}</p>
                                    <p><i className='text-[16px]'>Tổng tiền (Bằng chữ): {totalAmount > 0 ? capitalizeFirstLetter(numberToWords(totalAmount)) : 'Không'}</i></p>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <div className="flex justify-end gap-2">
                    <Button onClick={() => onClose(false)}>Huỷ</Button>
                    <Button onClick={handleSubmit}>Xác nhận xuất phiếu chi</Button>
                </div>
            </DialogContent>
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0 left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    );
}
