import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ShoppingCart, Logs, LogOut, ScrollText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export default function AvatarDropdownMenu({
    setUserProfileDialog,
}: {
    setUserProfileDialog: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Avatar className="w-10 h-10 hover:cursor-pointer">
                    <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="avatar-img"
                    />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => setUserProfileDialog(true)}>
                        <User className="mr-2 w-4 h-4" />
                        <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => router.push('/order')}>
                        <Logs className="mr-2 w-4 h-4" />
                        <span>Đặt hàng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => router.push('/cart')}>
                        <ShoppingCart className="mr-2 w-4 h-4" />
                        <span>Giỏ hàng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push('/order/history')}
                    >
                        <ScrollText className="mr-2 w-4 h-4" />
                        <span>Lịch sử đơn hàng</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={handleLogout}>
                        <LogOut className="mr-2 w-4 h-4" />
                        <span>Đăng xuất</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
