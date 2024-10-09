import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User, ShoppingCart, Logs, LogOut} from 'lucide-react'
import {useRouter} from "next/navigation";

export default function AvatarDropdownMenu() {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Avatar className='w-10 h-10 hover:cursor-pointer'>
                    <AvatarImage src='https://github.com/shadcn.png' alt='avatar-img'/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        <User className='mr-2 w-4 h-4'/>
                        <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/order')}>
                        <Logs className='mr-2 w-4 h-4'/>
                        <span>Đặt hàng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/cart')}>
                        <ShoppingCart className='mr-2 w-4 h-4'/>
                        <span>Giỏ hàng</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <LogOut className='mr-2 w-4 h-4'/>
                        <span>Đăng xuất</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}