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
    const [inputDetail, setInputDetail] = React.useState<number>();
    const [note, setNote] = React.useState<string>();
    const [popoverActive, setPopoverActive] = React.useState<boolean>(false);

    function getEmployeeActiveDate(date: string) {
        return activeDays?.find(
            (activeDay) =>
                new Date(activeDay.dayActive).toLocaleDateString() === date,
        );
    }

    function handlePopoverActive() {
        setActive(variant === 'active');
        setInputDetail(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString())
                ?.mass || 0,
        );
        setNote(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString())
                ?.note || '',
        );
        setPopoverActive(!popoverActive);
    }

    useEffect(() => {
        setActive(variant === 'active');
        setInputDetail(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString())
                ?.mass || 0,
        );
        setNote(
            getEmployeeActiveDate(new Date(day.localDate).toLocaleDateString())
                ?.note || '',
        );
    }, [employee]);

    return (
        <Popover open={popoverActive} onOpenChange={handlePopoverActive}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 space-y-4">
                <div>
                    <p className="font-medium leading-none">
                        Ngày: {new Date(day.localDate).toLocaleDateString()}{' '}
                    </p>
                </div>
                <EmployeePopoverContent
                    detail={inputDetail}
                    setDetail={setInputDetail}
                    active={active}
                    setActive={setActive}
                    role={employee.employeeRole}
                    day={day}
                    employee={employee}
                    variant={variant}
                    note={note || ''}
                    setNote={setNote}
                    startTransition={startTransition}
                    refreshActiveDays={refreshActiveDays}
                    setRefreshActiveDays={setRefreshActiveDays}
                    handlePopoverActive={handlePopoverActive}
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
}) {
    async function handleCreateEmployeeActiveDay(
        bodyRequest: EmployeeDayActiveBodyRequest,
    ) {
        startTransition(async () => {
            try {
                await createEmployeeActiveDay(bodyRequest);
                setRefreshActiveDays(!refreshActiveDays);
                handlePopoverActive();
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
                await deleteActiveDay(bodyRequest);
                setRefreshActiveDays(!refreshActiveDays);
                handlePopoverActive();
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
                await updateEmployeeActiveDay(bodyRequest);
                setRefreshActiveDays(!refreshActiveDays);
                handlePopoverActive();
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
            {role === 'PORTER' && (
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="mass">Số lượng (Tấn)</Label>
                    <Input
                        id="mass"
                        className="col-span-2"
                        value={detail}
                        type="number"
                        onChange={(value) =>
                            setDetail(parseInt(value.target.value))
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
                                            ).toLocaleDateString(),
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
                                            ).toLocaleDateString(),
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
                                            ).toLocaleDateString(),
                                            mass: detail || null,
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
