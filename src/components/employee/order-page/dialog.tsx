import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";

export default function OrderPageDialog({open, onOpenChange, price}: {
    open: boolean,
    onOpenChange: Dispatch<SetStateAction<boolean>>,
    price: number
}) {
    const [mass, setMass] = useState(1000);
    const calculateTotalCost = (mass: number) => {
        return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(mass * price);
    }
    const {toast} = useToast();

    const handleMassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMass(parseInt(e.target.value));
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>Đơn hàng</DialogTitle>
                    <DialogDescription>
                        Nhập khối lượng bạn muốn đặt với mặt hàng này, lưu ý khối lượng được tính theo Kilogram
                    </DialogDescription>
                </DialogHeader>
                <section className='grid gap-4 gap-y-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='mass'>
                            Nhập khối lượng
                        </Label>
                        <Input id='mass' type='number' defaultValue='1000' onChange={handleMassChange}
                               className='col-span-3'/>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='mass'>
                            Tổng tiền
                        </Label>
                        <Input id='total-cost' value={calculateTotalCost(mass)} className='col-span-3'
                               disabled/>
                    </div>
                    <div className='w-full flex justify-center'>
                        <Button onClick={() => {
                            onOpenChange(false)
                            toast({
                                title: 'Đặt hàng thành công',
                                description: 'Đơn hàng của bạn đã thêm vào giỏ hàng',
                            })
                        }} className='w-full max-w-[80%]'>Đặt hàng</Button>
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    )
}