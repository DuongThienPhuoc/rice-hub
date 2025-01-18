import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import React, { useEffect } from 'react';
import { Day } from '@/app/(admin)/salary/day-card';
import {
    DayActive,
    Employee,
    EmployeeDayActiveBodyRequest,
    DeleteActiveDayBodyRequest,
    UpdateEmployeeDayActiveBodyRequest,
} from '@/type/employee';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    createEmployeeActiveDay,
    deleteActiveDay,
    updateEmployeeActiveDay,
} from '@/data/employee';
import { isAxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';

export default function SalaryPopoverProvider({
    day,
    children,
    employee,
    variant,
    startTransition,
    activeDays,
    refreshActiveDays,
    setRefreshActiveDays,
}: {
    day: Day;
    children: React.ReactNode;
    employee: Employee;
    variant?: 'active' | 'inactive' | 'default';
    startTransition: React.TransitionStartFunction;
    activeDays: DayActive[];
    refreshActiveDays: boolean;
    setRefreshActiveDays: (value: boolean) => void;
}) {
    const [active, setActive] = React.useState<boolean>(variant === 'active');
    const [inputDetail, setInputDetail] = React.useState<number>(0);
    const [note, setNote] = React.useState<string>();
    const [popoverActive, setPopoverActive] = React.useState<boolean>(false);

    function getEmployeeActiveDate(date: string) {
        return activeDays?.find(
            (activeDay) =>
                new Date(activeDay.dayActive).toLocaleDateString('en-US') === date,
        );
    }

    function handlePopoverActive() {
        setActive(variant === 'active');
        setInputDetail(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString('en-US'))
                ?.mass || 0,
        );
        setNote(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString('en-US'))
                ?.note || '',
        );
        setPopoverActive(!popoverActive);
    }

    useEffect(() => {
        setActive(variant === 'active');
        setInputDetail(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString('en-US'))
                ?.mass || 0,
        );
        setNote(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString('en-US'))
                ?.note || '',
        );
    }, [employee]);

    return (
        <Popover open={popoverActive} onOpenChange={handlePopoverActive}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 space-y-4">
                <div>
                    <p className="font-medium leading-none">
                        Ngày: {new Date(day.localDate).toLocaleDateString('en-US')}{' '}
                    </p>
                </div>
                <EmployeePopoverContent
                    detail={inputDetail}
                    setDetail={setInputDetail}
                    active={active}
                    setActive={setActive}
                    role={employee.employeeSalaryType}
                    day={day}
                    employee={employee}
                    variant={variant}
                    note={note || ''}
                    setNote={setNote}
                    startTransition={startTransition}
                    refreshActiveDays={refreshActiveDays}
                    setRefreshActiveDays={setRefreshActiveDays}
                    handlePopoverActive={handlePopoverActive}
                    getEmployeeActiveDate={getEmployeeActiveDate}
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
    day,
    employee,
    variant,
    note,
    setNote,
    startTransition,
    refreshActiveDays,
    setRefreshActiveDays,
    handlePopoverActive,
    getEmployeeActiveDate,
}: {
    detail: number | undefined;
    setDetail: (value: number) => void;
    active: boolean;
    setActive: (value: boolean) => void;
    role: string;
    day: Day;
    employee: Employee;
    variant?: 'active' | 'inactive' | 'default';
    note: string;
    setNote: (value: string) => void;
    startTransition: React.TransitionStartFunction;
    refreshActiveDays: boolean;
    setRefreshActiveDays: (value: boolean) => void;
    handlePopoverActive: () => void;
    getEmployeeActiveDate: (date: string) => DayActive | undefined;
}) {
    const { toast } = useToast();
    async function handleCreateEmployeeActiveDay(
        bodyRequest: EmployeeDayActiveBodyRequest,
    ) {
        startTransition(async () => {
            try {
                if(new Date(bodyRequest.dayActive) > new Date()) {
                    toast({
                        variant: 'destructive',
                        title: 'Thất bại',
                        description: 'Không thể tạo ngày đi làm trong tương lai',
                        duration: 3000,
                    });
                    return;
                }else if((bodyRequest.mass == null || bodyRequest.mass <= 0 || isNaN(bodyRequest.mass as number)) && role === 'DAILY') {
                    toast({
                        variant: 'destructive',
                        title: 'Thất bại',
                        description: 'Không thể tạo ngày đi làm với số lượng bằng 0',
                        duration: 3000,
                    });
                    return;
                } else {
                    await createEmployeeActiveDay(bodyRequest);
                    setRefreshActiveDays(!refreshActiveDays);
                    handlePopoverActive();
                }
            } catch (e) {
                if (isAxiosError(e)) {
                    throw e;
                }
            }
        });
    }
    async function handleDeleteEmployeeActiveDay(
        bodyRequest: DeleteActiveDayBodyRequest,
    ) {
        startTransition(async () => {
            try {
                if(getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString('en-US'))?.spend === true) {
                    toast({
                        variant: 'destructive',
                        title: 'Thất bại',
                        description: 'Không thể xoá ngày đi làm đã chi tiền',
                        duration: 3000,
                    });
                    handlePopoverActive();
                    return;
                }else {
                    await deleteActiveDay(bodyRequest);
                    setRefreshActiveDays(!refreshActiveDays);
                    handlePopoverActive();
                }
            } catch (e) {
                if (isAxiosError(e)) {
                    throw e;
                } else {
                    console.error(e);
                }
            }
        });
    }

    async function handleUpdateEmployeeActiveDay(
        bodyRequest: UpdateEmployeeDayActiveBodyRequest,
    ) {
        startTransition(async () => {
            try {
                if (bodyRequest.mass == null || bodyRequest.mass <= 0 || isNaN(bodyRequest.mass as number)) {
                    toast({
                        variant: 'destructive',
                        title: 'Thất bại',
                        description: 'Không thể cập nhật ngày đi làm với số lượng nhỏ hơn hoặc bằng 0',
                        duration: 3000,
                    });
                    handlePopoverActive();
                    return;
                } else if(getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString('en-US'))?.spend === true) {
                    toast({
                        variant: 'destructive',
                        title: 'Thất bại',
                        description: 'Không thể cập nhật ngày đi làm đã chi tiền',
                        duration: 3000,
                    });
                    handlePopoverActive();
                    return;
                } else {
                    await updateEmployeeActiveDay(bodyRequest);
                    setRefreshActiveDays(!refreshActiveDays);
                    handlePopoverActive();
                }
            } catch (e) {
                if (isAxiosError(e)) {
                    throw e;
                } else {
                    console.error(e);
                }
            }
        });
    }

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
            {role === 'DAILY' && (
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="mass">Số lượng (Tấn)</Label>
                    <Input
                        id="mass"
                        className="col-span-2"
                        value={detail}
                        type="number"
                        step='0.01'
                        min='0'
                        onChange={(value) =>
                            setDetail(parseFloat(value.target.value))
                        }
                        disabled={!active}
                    />
                </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                    id="note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="col-span-2"
                    disabled={!active}
                />
            </div>
            <div>
                {variant === 'active' ? (
                    <>
                        {active ? (
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const bodyRequest: EmployeeDayActiveBodyRequest =
                                    {
                                        employeeId: employee.id,
                                        dayActive: new Date(
                                            day.localDate,
                                        ).toLocaleDateString('en-US'),
                                        amountPerMass: 0.0,
                                        mass: detail || null,
                                        note: note,
                                    };
                                    handleUpdateEmployeeActiveDay(
                                        bodyRequest,
                                    ).catch((e) => {
                                        if (isAxiosError(e)) {
                                            console.error(e);
                                        }
                                    });
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const bodyRequest: DeleteActiveDayBodyRequest =
                                    {
                                        employeeId: employee.id,
                                        date: new Date(
                                            day.localDate,
                                        ).toLocaleDateString('en-US'),
                                    };
                                    handleDeleteEmployeeActiveDay(
                                        bodyRequest,
                                    ).catch((e) => {
                                        if (isAxiosError(e)) {
                                            console.error(e);
                                        }
                                    });
                                }}
                            >
                                Xoá
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {active && (
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const bodyRequest: EmployeeDayActiveBodyRequest =
                                    {
                                        employeeId: employee.id,
                                        dayActive: new Date(
                                            day.localDate,
                                        ).toLocaleDateString('en-US'),
                                        amountPerMass: 0.0,
                                        mass: detail || 0,
                                        note: note,
                                    };
                                    handleCreateEmployeeActiveDay(
                                        bodyRequest,
                                    ).catch((e) => {
                                        if (isAxiosError(e)) {
                                            console.error(e);
                                        }
                                    });
                                }}
                            >
                                Thêm
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
