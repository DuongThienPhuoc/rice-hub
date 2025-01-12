'use client';

import api from '@/config/axiosConfig';
import { usePathname } from 'next/navigation';
import {
    Sidebar,
    SidebarContent, SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import {
    ArrowRightFromLine,
    BadgeDollarSign,
    ChevronDown,
    ChevronsUpDown,
    DollarSign,
    Factory,
    Home,
    Import,
    Library,
    LogOut,
    Logs,
    MonitorCheck,
    Package,
    PackageCheck,
    PackageMinus,
    PackagePlus,
    PenBox,
    ScrollText,
    ShoppingCart,
    SquareArrowRight,
    User,
    UserCog,
    UserPen,
    Users,
    History
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';
import { FaChartBar } from 'react-icons/fa';
import { User as UserInterface } from '@/type/user';
import { getUserInformation } from '@/data/user';

type SidebarItem = {
    category: string;
    role: string[];
    items: {
        title: string;
        url: string;
        icon: React.ReactElement;
        role: string[];
    }[];
};
const categories: SidebarItem[] = [
    {
        category: 'Quản lý',
        role: ['ROLE_ADMIN'],
        items: [
            {
                title: 'Quản lý tài chính',
                url: '/dashboard',
                icon: <FaChartBar />,
                role: ['ROLE_ADMIN'],
            },
            {
                title: 'Lịch sử hoạt động',
                url: '/user-activity',
                icon: <History />,
                role: ['ROLE_ADMIN'],
            }
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
                role: ['ROLE_CUSTOMER'],
            },
            {
                title: 'Đặt hàng',
                url: '/order',
                icon: <Logs />,
                role: ['ROLE_CUSTOMER'],
            },
            {
                title: 'Giỏ hàng',
                url: '/cart',
                icon: <ShoppingCart />,
                role: ['ROLE_CUSTOMER'],
            },
            {
                title: 'Lịch sử đơn hàng',
                url: '/order/history',
                icon: <ScrollText />,
                role: ['ROLE_CUSTOMER']
            },
        ],
    },
    {
        category: 'Hàng hoá',
        role: ['ROLE_ADMIN', "WAREHOUSE_MANAGER"],
        items: [
            {
                title: 'Danh mục',
                url: '/categories',
                icon: <Library />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
            {
                title: 'Sản phẩm',
                url: '/products',
                icon: <Package />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
            {
                title: 'Nguyên liệu',
                url: '/ingredients',
                icon: <SquareArrowRight />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
            {
                title: 'Bảng giá',
                url: '/prices',
                icon: <DollarSign />,
                role: ['ROLE_ADMIN'],
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
                role: ['ROLE_ADMIN',],
            },
            {
                title: 'Nhà sản xuất',
                url: '/suppliers',
                icon: <UserPen />,
                role: ['ROLE_ADMIN'],
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
                role: ['ROLE_ADMIN'],
            },
            {
                title: 'Chấm công',
                url: '/salary',
                icon: <MonitorCheck />,
                role: ['ROLE_ADMIN'],
            },
            {
                title: 'Bảng lương',
                url: '/payroll',
                icon: <BadgeDollarSign />,
                role: ['ROLE_ADMIN'],
            },
        ],
    },
    {
        category: 'Giao dịch',
        role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
        items: [
            {
                title: 'Thu',
                url: '/income',
                icon: <Import />,
                role: ['ROLE_ADMIN'],
            },
            {
                title: 'Chi',
                url: '/expenditures',
                icon: <ArrowRightFromLine />,
                role: ['ROLE_ADMIN'],
            },
            {
                title: 'Đơn hàng',
                url: '/admin/orders',
                icon: <PackageCheck />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
        ],
    },
    {
        category: 'Quản lý kho',
        role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
        items: [
            {
                title: 'Nhập kho',
                url: '/import',
                icon: <PackagePlus />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
            {
                title: 'Xuất kho',
                url: '/export',
                icon: <PackageMinus />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
            {
                title: 'Kiểm kho',
                url: '/inventory',
                icon: <PenBox />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
            {
                title: 'Sản xuất',
                url: '/production',
                icon: <Factory />,
                role: ['ROLE_ADMIN', 'WAREHOUSE_MANAGER'],
            },
        ],
    },
];

export default function AppSidebar() {
    const [userProfileDialog, setUserProfileDialog] = useState(false);
    const pathName = usePathname();
    const [role, setRole] = React.useState<string>('');
    const [employeeRole, setEmployeeRole] = React.useState<string>('');
    const [userName, setUserName] = React.useState<string>('');
    const [userInformation, setUserInformation] = useState<UserInterface>(
        {} as UserInterface,
    );
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const role = localStorage.getItem('role');
        const userName = localStorage.getItem('username');
        const employeeRole = localStorage.getItem('employeeRole');
        if (role !== null && userName !== null) {
            setRole(role);
            setUserName(userName);
        }
        if (employeeRole !== null) {
            setEmployeeRole(employeeRole);
        }
    }, []);

    useEffect(() => {
        fetchUserInformation().catch((error) => {
            console.error('Error occurred while retrieving user information:', error);
        })
    }, [userName]);

    async function fetchUserInformation() {
        try {
            if (!userName) return;
            const data = await getUserInformation<UserInterface>(userName);
            setUserInformation(data);
        } catch (error) {
            throw error
        }
    }

    function isHiddenCategory(category: SidebarItem) {
        if (role !== 'ROLE_EMPLOYEE') {
            return !category.role.includes(role);
        } else {
            return !category.role.includes(employeeRole);
        }
    }
    function isHiddenItem(item: string[]) {
        if (role !== 'ROLE_EMPLOYEE') {
            return !item.includes(role);
        } else {
            return !item.includes(employeeRole);
        }
    }

    const handleLogout = async () => {
        try {
            const url = `/logout/logoutRequest`;
            await api.post(url);
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            document.cookie = `userID=; path=/; max-age=0`;
            window.location.href = '/'
        } catch (error) {
            console.error('Đăng xuất thất bại:', error);
        }
    };

    return (
        <Sidebar collapsible="icon">
            {userProfileDialog && (
                <UserProfileDialog
                    open={userProfileDialog}
                    setOpen={setUserProfileDialog}
                    user={userInformation}
                    fetchUserInformation={fetchUserInformation}
                />
            )}
            <SidebarHeader className="px-1 py-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="py-5 flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage
                                                src={
                                                    userInformation.image || ''
                                                }
                                                alt="@logo"
                                            />
                                            <AvatarFallback>
                                                {userName
                                                    ?.split('')[0]
                                                    ?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="font-semibold text-sm">
                                                {userName}
                                            </span>
                                            <br />
                                            <span className="font-normal text-[12px]">
                                                {userInformation.email}
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
                        <SidebarGroup
                            className={cn(isHiddenCategory(category) ? 'hidden' : '')}
                        >
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
                                            <SidebarMenuItem key={item.title} className={cn(isHiddenItem(item.role) ? 'hidden' : '')}>
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
