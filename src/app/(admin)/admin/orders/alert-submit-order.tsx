import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

type AlertDeleteProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    createOrder: () => void;
    phoneNumber: string;
    address: string;
    setPhone: (phone: string) => void;
    setAddress: (address: string) => void;
};
export default function AlertSubmitOrder({
    isOpen,
    setIsOpen,
    createOrder,
    phoneNumber,
    address,
    setPhone,
    setAddress
}: AlertDeleteProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Thông báo!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Vui lòng xác nhận lại số điện thoại và địa chỉ
                        </AlertDialogDescription>
                        <div className='space-y-4'>
                            <div>
                                <Label htmlFor='phone'>Số điện thoại</Label>
                                <Input
                                    id='phone'
                                    className="w-full"
                                    placeholder="Số điện thoại"
                                    value={phoneNumber}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor='address'>Địa chỉ</Label>
                                <Textarea
                                    id='address'
                                    className="w-full"
                                    placeholder="Địa chỉ"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </AlertDialogHeader>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        Huỷ bỏ
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={createOrder}>
                        Tiếp tục
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
