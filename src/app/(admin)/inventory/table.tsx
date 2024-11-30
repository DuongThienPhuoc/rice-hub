/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import * as React from 'react';
import InventoryList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { ButtonGroup, Button, Skeleton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Separator } from '@/components/ui/separator';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../expenditures/date-range-picker';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useToast } from '@/hooks/use-toast';

export default function InventoryTable() {
    const router = useRouter();
    const columns = [
        { name: 'inventoryCode', displayName: 'Mã phiếu' },
        { name: 'inventoryDate', displayName: 'Ngày tạo phiếu' },
        { name: 'warehouse.name', displayName: 'Kho' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
    const [onPageChange, setOnPageChange] = useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const options = ['Tạo phiếu kiểm kho sản xuất', 'Tạo phiếu kiểm kho nguyên liệu'];
    const [loadingData, setLoadingData] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const { toast } = useToast();

    const handleClick = () => {
        setOnPageChange(true);
        if (options[selectedIndex] === 'Tạo phiếu kiểm kho sản xuất') {
            router.push("/inventory/createProducts");
        } else {
            router.push("/inventory/createIngredients");
        }
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    const getInventory = async (page?: number, search?: { field?: string, query?: string }, startDate?: any, endDate?: any) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (startDate && endDate) {
                params.append("startDate", new Date(new Date(startDate).setDate(new Date(startDate).getDate())).toISOString());
                params.append("endDate", new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/inventory/getAll?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data?._embedded?.inventoryDtoList) {
                setInventory(data._embedded.inventoryDtoList);
                setTotalPages(data.page.totalPages);
            } else {
                setInventory([]);
                toast({
                    variant: 'destructive',
                    title: 'Không tìm thấy phiếu kiểm kho!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000,
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách phiếu kiểm kho!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getInventory(currentPage, currentSearch, startDate, endDate);
    }, [currentPage, currentSearch, startDate, endDate]);

    useEffect(() => {
        setStartDate(date?.from || null);
        setEndDate(date?.to || null);
    }, [date]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='p-5 bg-white rounded-lg'>
                        {loadingData ? (
                            <div className='mb-5'>
                                <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                                <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                            </div>
                        ) : (
                            <div className="space-y-2 mb-5">
                                <div className='font-bold text-[1.25rem]'>Phiếu kiểm kho</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách phiếu kiểm kho
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col xl:flex-row justify-between items-center xl:items-middle my-5'>
                            <div className='flex flex-col lg:flex-row items-center mt-2 lg:mt-0'>
                                <div className='flex space-x-2 md:items-center space-y-2 md:space-y-0 md:flex-row flex-col'>
                                    <SearchBar
                                        onSearch={handleSearch}
                                        loadingData={loadingData}
                                        selectOptions={[
                                            { value: 'inventoryCode', label: 'Mã phiếu' }
                                        ]}
                                    />
                                    {loadingData ? (
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
                                    ) : (
                                        <DatePickerWithRange date={date} setDate={setDate} />
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col xl:flex-row items-center mt-2 xl:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
                                ) : (
                                    <>
                                        <ButtonGroup
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#4ba94d',
                                                '& .MuiButton-root': {
                                                    border: 'none',
                                                    '&:hover': {
                                                        backgroundColor: '#22c55e',
                                                    },
                                                },
                                            }}
                                            ref={anchorRef}
                                        >
                                            <Button
                                                className='bg-[#4ba94d] hover:bg-green-500'
                                                onClick={handleClick}>{options[selectedIndex]}</Button>
                                            <Button
                                                className='bg-[#4ba94d] hover:bg-green-500'
                                                size="small"
                                                aria-controls={open ? 'split-button-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-label="select merge strategy"
                                                aria-haspopup="menu"
                                                onClick={handleToggle}
                                            >
                                                <ArrowDropDownIcon />
                                            </Button>
                                        </ButtonGroup>
                                        <Popper
                                            sx={{ zIndex: 1 }}
                                            open={open}
                                            anchorEl={anchorRef.current}
                                            role={undefined}
                                            transition
                                            disablePortal
                                        >
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    style={{
                                                        transformOrigin:
                                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                                    }}
                                                >
                                                    <Paper >
                                                        <ClickAwayListener onClickAway={handleClose}>
                                                            <MenuList id="split-button-menu" autoFocusItem>
                                                                {options.map((option, index) => (
                                                                    <MenuItem
                                                                        key={option}
                                                                        disabled={index === 2}
                                                                        selected={index === selectedIndex}
                                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                ))}
                                                            </MenuList>
                                                        </ClickAwayListener>
                                                    </Paper>
                                                </Grow>
                                            )}
                                        </Popper>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <InventoryList name="Phiếu kiểm kho" editUrl="/inventory/updateInventory" loadingData={loadingData} titles={titles} columns={columns} data={inventory} tableName="inventory" />
                        </div>
                        {totalPages > 1 && (
                            <Paging
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </section>
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0 left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
            <FloatingButton />
        </div>
    );
};

