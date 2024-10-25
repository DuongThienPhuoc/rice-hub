'use client';

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
    Logs
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

const categories = [
    {
        category: 'Quản lý tài chính',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Tài Chính',
                url: '/dashboard',
                icon: <Home />,
            },
        ],
    },
    {
        category: 'Đơn hàng',
        role: ['ROLE_CUSTOMER', 'ROLE_ADMIN'],
        items: [
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
                url: '#',
                icon: <SquareArrowRight />,
            },
            {
                title: 'Bảng giá',
                url: '#',
                icon: <DollarSign />,
            },
        ],
    },
    {
        category: 'Giao dịch',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Thu',
                url: '#',
                icon: <Import />,
            },
            {
                title: 'Chi',
                url: '#',
                icon: <ArrowRightFromLine />,
            },
        ],
    },
];

export default function AppSidebar() {
    const [userProfileDialog, setUserProfileDialog] = useState(false);
    const pathName = usePathname();
    const [role, setRole] = React.useState<string>('')
    useEffect(() => {
        const role = typeof window != 'undefined' ? localStorage.getItem('role') : '';
        if(role !== null){
            setRole(role)
        }
    },[role])

    function isHidden(category:any) {
        return !category.role.includes(role);
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
                                    <DropdownMenuItem>
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
