import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Separator } from '@/components/ui/separator';
import { getActiveDay } from '@/data/employee';
import { DayActive } from '@/type/employee';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

    async function getMonthlyEmployeeActiveDay() {
        try {
            const response = await getActiveDay(employeeId, month + 1, year);
            setDayActive(response.data);
        } catch (e) {
            throw e;
        }
    }

    React.useEffect(() => {
        getMonthlyEmployeeActiveDay().catch((e) =>
            console.error(`Error: ${e}`),
        );
    }, [employeeId]);

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
                <div className="rounded border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Ngày đi làm</TableHead>
                                <TableHead>Năng suất làm việc (Tấn)</TableHead>
                                <TableHead>Số tiền mỗi tấn</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dayActive.map((day) => (
                                <TableRow key={day.id}>
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            day.dayActive,
                                        ).toLocaleDateString('en-US')}
                                    </TableCell>
                                    <TableCell>{day.mass}</TableCell>
                                    <TableCell>
                                        <Input type="number" value={12000} />
                                    </TableCell>
                                    <TableCell className="text-destructive">
                                        Chưa xuất phiếu chi
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end gap-2">
                    <Button onClick={() => onClose(false)}>Huỷ</Button>
                    <Button>Xác nhận xuất phiếu chi</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
