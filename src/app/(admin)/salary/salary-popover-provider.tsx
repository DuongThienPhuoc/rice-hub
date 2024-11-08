import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import React, { useEffect } from 'react';
import { Day } from '@/app/(admin)/salary/day-card';
import { Employee } from '@/type/employee';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function SalaryPopoverProvider({
    day,
    children,
    employee,
    variant,
}: {
    day: Day;
    children: React.ReactNode;
    employee: Employee;
    variant?: 'active' | 'inactive' | 'default';
}) {
    function getEmployeeActiveDate(date: string) {
        return employee.dayActive?.find(
            (activeDate) =>
                new Date(activeDate.dayActive).toLocaleDateString() === date,
        );
    }

    const [active, setActive] = React.useState<boolean>(variant === 'active');
    const [inputDetail, setInputDetail] = React.useState<string>(getEmployeeActiveDate(day.localDate)?.mass || '');

    useEffect(() => {
        setActive(variant === 'active');
        setInputDetail(getEmployeeActiveDate(day.localDate)?.mass || '');
    }, [variant]);

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 space-y-4">
                <div>
                    <p className="font-medium leading-none">
                        Ngày: {day.localDate}{' '}
                    </p>
                </div>
                <EmployeePopoverContent
                    detail={inputDetail}
                    setDetail={setInputDetail}
                    active={active}
                    setActive={setActive}
                    role={employee.employeeRole}
                />
            </PopoverContent>
        </Popover>
    );
}

function EmployeePopoverContent({
    detail,
    setDetail,
    active,
    setActive,
    role,
}: {
    detail: string;
    setDetail: React.Dispatch<React.SetStateAction<string>>;
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    role: string;
}) {
    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="active">Trạng thái</Label>
                <div className="col-span-2 flex items-center space-x-2">
                    <Checkbox
                        id="active"
                        checked={active}
                        onCheckedChange={() => setActive(!active)}
                    />
                    <label
                        htmlFor="active"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Xác nhận có đi làm
                    </label>
                </div>
            </div>
            {role === 'PORTER' && (
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="mass">Số lượng (Tấn)</Label>
                    <Input
                        id="mass"
                        className="col-span-2"
                        value={detail}
                        onChange={(value) => setDetail(value.target.value)}
                        disabled={!active}
                    />
                </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea id="note" className="col-span-2" disabled={!active} />
            </div>
            <div>
                <Button className="w-full">Xác nhận</Button>
            </div>
        </div>
    );
}
