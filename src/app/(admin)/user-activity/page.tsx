'use client';

import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getUserActivity, GetUserActivityProps } from '@/data/user-activity';
import { UserActivityResponse } from '@/type/user-activity';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { vi } from 'date-fns/locale';
import { mappingActivity } from '@/utils/mapping';
import { Input } from '@/components/ui/input';
import PaginationComponent from '@/components/pagination/pagination';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import UserActivityPageBreadcrumb from '@/app/(admin)/user-activity/breadcrumb';

export default function UserActivityPage() {
    const [userActivity, setUserActivity] =
        React.useState<UserActivityResponse | null>(null);
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [search, setSearch] = React.useState<string>('');
    const fetchUserActivity = React.useCallback(async () => {
        const endDateUTC = new Date(date?.to || new Date());
        const endDateNumber = new Date(endDateUTC).setDate(
            endDateUTC.getDate() + 1,
        );
        const endDate = new Date(endDateNumber).toISOString();
        try {
            const response = await getUserActivity<UserActivityResponse>({
                username: search !== '' ? search : undefined,
                pageNumber: currentPage + 1,
                startDate: date?.from?.toISOString(),
                endDate: date?.to ? endDate : undefined,
            } as GetUserActivityProps);
            setUserActivity(response);
        } catch (e) {
            throw e;
        }
    }, [currentPage, date, search]);
    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        fetchUserActivity().catch((e) => console.error(e));
    }, [currentPage, search, date]);

    useEffect(() => {
        setBreadcrumb(<UserActivityPageBreadcrumb />);
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

    return (
        <div className="bg-white p-5 mx-5 rounded-lg space-y-4">
            <div className="space-y-2 mb-5">
                <div className="font-bold text-[1.25rem]">
                    Lịch sử hoạt động
                </div>
                <p className="text-sm text-muted-foreground">
                    Quản lý lịch sử hoạt động trên hệ thống
                </p>
            </div>
            <Separator orientation="horizontal" />
            <div className="grid gap-y-2 md:flex md:items-center md:gap-x-2">
                <div className="relative w-full h-full md:w-[300px]">
                    <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-green-500" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 border-green-500 focus-visible:ring-green-500"
                        placeholder="Nhập tên người dùng"
                    />
                </div>
                <div className="grid gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={'outline'}
                                className={cn(
                                    'md:w-[300px] w-full justify-start text-left bg-[#4ba94d] h-[40px] font-semibold hover:bg-green-500',
                                    !date && 'text-muted-foreground',
                                )}
                            >
                                <CalendarIcon color="white" />
                                <div className="font-semibold text-white">
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(
                                                    date.from,
                                                    'MM/dd/yyyy',
                                                )}{' '}
                                                -{' '}
                                                {format(date.to, 'MM/dd/yyyy')}
                                            </>
                                        ) : (
                                            format(date.from, 'MM/dd/yyyy')
                                        )
                                    ) : (
                                        <>Chọn khoảng ngày</>
                                    )}
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                locale={vi}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader className="bg-[#0090d9]">
                        <TableRow>
                            <TableHead className="text-white rounded-tl-md">
                                Người dùng
                            </TableHead>
                            <TableHead className="text-white">
                                Đối tượng
                            </TableHead>
                            <TableHead className="text-white">
                                Hoạt động
                            </TableHead>
                            <TableHead className="text-white rounded-tr-md">
                                Thời gian
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userActivity?._embedded?.userActivityList.map(
                            (activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>{activity.username}</TableCell>
                                    <TableCell>{activity.object}</TableCell>
                                    <TableCell
                                        style={{
                                            color: mappingActivity[activity.activity].color
                                        }}
                                    >
                                        {
                                            mappingActivity[activity.activity]
                                                .text
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            activity.timestamp,
                                        ).toLocaleDateString('en-US')}
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <PaginationComponent
                    totalPages={userActivity?.page.totalPages || 0}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}
