'use client';
import * as React from 'react';
import InventoryList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import { ButtonGroup, Button, Skeleton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

export default function InventoryTable() {
    const router = useRouter();
    const columns = [
        { name: 'id', displayName: 'Mã phiếu' },
        { name: 'inventoryDate', displayName: 'Ngày tạo phiếu' },
        { name: 'warehouse.name', displayName: 'Kho' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
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

    const handleClick = () => {
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

    const getInventory = async (page?: number, search?: { field?: string, query?: string }) => {
        setLoadingData(true);
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/inventory/getAll?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            setInventory(data._embedded.inventoryDtoList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu kiểm kho:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getInventory(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

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
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            loadingData={loadingData}
                            selectOptions={[
                                { value: 'id', label: 'Mã phiếu' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {loadingData ? (
                                <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                            ) : (
                                <>
                                    <ButtonGroup
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#1d1d1f',
                                            '& .MuiButton-root': {
                                                border: 'none',
                                                '&:hover': {
                                                    backgroundColor: '#1d1d1fca',
                                                },
                                            },
                                        }}
                                        ref={anchorRef}
                                    >
                                        <Button
                                            className='bg-[#1d1d1f] hover:bg-[#1d1d1fca]'
                                            onClick={handleClick}>{options[selectedIndex]}</Button>
                                        <Button
                                            className='bg-[#1d1d1f] hover:bg-[#1d1d1fca]'
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
            </section>
            <FloatingButton />
        </div>
    );
};

