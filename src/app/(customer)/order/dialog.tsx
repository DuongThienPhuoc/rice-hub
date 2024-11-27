import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToastAction } from '@/components/ui/toast';
import { useCartDialogStore } from '@/stores/cartDialogStore';
import { ProductDtoList } from '@/data/customer-product';

export default function OrderPageDialog({
    open,
    onOpenChange,
    product,
}: {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    product: ProductDtoList;
}) {
    const { toast } = useToast();

    const type = useCartDialogStore((state) => state.type);
    const quantity = useCartDialogStore((state) => state.quantity);
    const setType = useCartDialogStore((state) => state.setType);
    const setQuantity = useCartDialogStore((state) => state.setQuantity);
    const [productUnit,setProductUnit] = useState<string>('')

    function handleSubmitOrder() {
        const getOrderId = JSON.parse(localStorage.getItem('cart') || '[]').length;
        const order = {
            cartId: getOrderId + 1,
            productID: product.id,
            productCode: product.productCode,
            name: product.name,
            productUnit: productUnit,
            quantity: quantity,
            price: product.customerPrice,
            type: type,
        };
        if (order.type === 0 || order.quantity === 0) {
            toast({
                variant: 'destructive',
                title: 'Xin hãy nhập đầy đủ thông tin',
                action: <ToastAction altText="Try again">OK!</ToastAction>,
            })
        } else {
            setType(0);
            setQuantity(1);
            const preOrder = JSON.parse(localStorage.getItem('cart') || '[]');
            localStorage.setItem('cart', JSON.stringify([...preOrder, order]));
            toast({
                title: 'Đặt hàng thành công',
                description: 'Đơn hàng của bạn đã thêm vào giỏ hàng',
            });
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Đơn hàng</DialogTitle>
                    <DialogDescription>
                        Nhập khối lượng bạn muốn đặt với mặt hàng này, lưu ý
                        khối lượng được tính theo Kilogram
                    </DialogDescription>
                </DialogHeader>
                <section className="grid gap-4 gap-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Loại</Label>
                        <Select onValueChange={(e) => {
                            const value = JSON.parse(e)
                            setProductUnit(value.productUnit)
                            setType(value.weightPerUnit)
                        }}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn quy cách đóng gói" />
                            </SelectTrigger>
                            <SelectContent>
                                {product.unitWeightPairsList.map((weight, index) => (
                                    <SelectItem key={index} value={JSON.stringify(weight)}>
                                        {weight.weightPerUnit} Kg
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mass">Nhập số lượng (bao)</Label>
                        <Input
                            id="mass"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                            }
                            className="col-span-3"
                        />
                    </div>
                    {type > 0 && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mass">Khối lượng (Kg)</Label>
                            <Input
                                id="mass"
                                type="number"
                                value={quantity * type}
                                disabled
                                className="col-span-3"
                            />
                        </div>
                    )}
                    <div className="w-full flex justify-center">
                        <Button
                            onClick={handleSubmitOrder}
                            className="w-full"
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    );
}
