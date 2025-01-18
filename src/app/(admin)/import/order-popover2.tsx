import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type OrderPopoverProviderProps = {
    children: React.ReactNode;
    quantity: number;
    setQuantity: (quantity: number) => void;
    addProductToOrder: () => void; // Thêm prop để nhận hàm xử lý
};

const OrderPopoverProvider2: React.FC<OrderPopoverProviderProps> = ({
    children,
    quantity,
    setQuantity,
    addProductToOrder, // Nhận hàm xử lý
}) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    function handleSubmit() {
        if (quantity <= 0 || isNaN(quantity)) {
            setError('Số lượng không được để trống hoặc nhỏ hơn 1');
        } else {
            setError('');
            addProductToOrder(); // Gọi hàm thêm sản phẩm
            setIsOpen(false); // Đóng Popover
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="quantity">Số lượng</Label>
                            <Input
                                id="quantity"
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(parseInt(event.target.value))
                                }
                                type="number"
                                min={1}
                                className="col-span-2 h-8 w-[165px]"
                            />
                        </div>
                        <div>
                            {error && (
                                <div className="p-1 bg-destructive text-white text-sm font-semibold text-center rounded">
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <Button className="w-full" onClick={handleSubmit}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default OrderPopoverProvider2;
