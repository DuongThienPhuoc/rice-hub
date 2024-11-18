/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import api from "../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    Home,
    ChevronsUpDown,
    User,
    ShoppingCart,
    ScrollText,
    LogOut,
    ChevronDown,
    Library,
    Package,
    DollarSign,
    SquareArrowRight,
    Import,
    ArrowRightFromLine,
    Logs,
    UserPen,
    Users,
    UserCog,
    PackageCheck,
    PenBox,
    PackagePlus,
    PackageMinus,
    MonitorCheck,
    BadgeDollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserProfileDialog from '@/components/navbar/user-profile-dialog';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';
import { FaChartBar } from "react-icons/fa";

const categories = [
    {
        category: 'Quản lý tài chính',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Thống kê',
                url: '/dashboard',
                icon: <FaChartBar />,
            },
        ],
    },
    {
        category: 'Đơn hàng',
        role: ['ROLE_CUSTOMER'],
        items: [
            {
                title: 'Trang chủ',
                url: '/',
                icon: <Home />,
            },
            {
                title: 'Đặt hàng',
                url: '/order',
                icon: <Logs />,
            },
            {
                title: 'Giỏ hàng',
                url: '/cart',
                icon: <ShoppingCart />,
            },
            {
                title: 'Lịch sử đơn hàng',
                url: '/order/history',
                icon: <ScrollText />,
            },
        ],
    },
    {
        category: 'Hàng hoá',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Danh mục',
                url: '/categories',
                icon: <Library />,
            },
            {
                title: 'Sản Phẩm',
                url: '/products',
                icon: <Package />,
            },
            {
                title: 'Nguyên Liệu',
                url: '/ingredients',
                icon: <SquareArrowRight />,
            },
            {
                title: 'Bảng giá',
                url: '/prices',
                icon: <DollarSign />,
            },
        ],
    },
    {
        category: 'Đối tác',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Khách hàng',
                url: '/customers',
                icon: <Users />,
            },
            {
                title: 'Nhà cung cấp',
                url: '/suppliers',
                icon: <UserPen />,
            },
        ],
    },
    {
        category: 'Nhân sự',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Nhân viên',
                url: '/employees',
                icon: <UserCog />,
            },
            {
                title: 'Chấm công',
                url: '/salary',
                icon: <MonitorCheck />,
            },
            {
                title: 'Bảng lương',
                url: '/payroll',
                icon: <BadgeDollarSign />,
            },
        ],
    },
    {
        category: 'Giao dịch',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Thu',
                url: '/income',
                icon: <Import />,
            },
            {
                title: 'Chi',
                url: '/expenditures',
                icon: <ArrowRightFromLine />,
            },
            {
                title: 'Đơn hàng',
                url: '/admin/orders',
                icon: <PackageCheck />,
            },
        ],
    },
    {
        category: 'Nhập xuất',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Nhập hàng',
                url: '/import',
                icon: <PackagePlus />,
            },
            {
                title: 'Xuất hàng',
                url: '/export',
                icon: <PackageMinus />,
            },
            {
                title: 'Kiểm hàng',
                url: '/inventory',
                icon: <PenBox />,
            },
        ],
    },
];

export default function AppSidebar() {
    const [userProfileDialog, setUserProfileDialog] = useState(false);
    const pathName = usePathname();
    const [role, setRole] = React.useState<string>('');
    const router = useRouter();
    useEffect(() => {
        const role = typeof window != 'undefined' ? localStorage.getItem('role') : '';
        if (role !== null) {
            setRole(role)
        }
    }, [role])

    function isHidden(category: any) {
        return !category.role.includes(role);
    }

    const handleLogout = async () => {
        try {
            const url = `/logout/logoutRequest`;
            await api.post(url);
            router.push('/');
        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
        }
    }

    return (
        <Sidebar collapsible="icon">
            <UserProfileDialog
                open={userProfileDialog}
                setOpen={setUserProfileDialog}
            />
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="py-5 flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage
                                                src="https://github.com/shadcn.png"
                                                alt="@logo"
                                            />
                                            <AvatarFallback>P</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="font-semibold text-sm">
                                                phuockingboy
                                            </span>
                                            <br />
                                            <span className="font-normal text-[12px]">
                                                phuocvip2@gmail.com
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronsUpDown className="w-4 h-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                    Tài khoản của tôi
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setUserProfileDialog(true)
                                        }
                                    >
                                        <User className="mr-2 w-4 h-4" />
                                        <span>Hồ sơ</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 w-4 h-4" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {categories.map((category) => (
                    <Collapsible
                        defaultOpen
                        className="group/collapsible"
                        key={category.category}
                    >
                        <SidebarGroup className={cn(isHidden(category) ? 'hidden' : '')}>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    {category.category}
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {category.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={
                                                        pathName === item.url
                                                    }
                                                >
                                                    <Link href={item.url}>
                                                        {item.icon}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
