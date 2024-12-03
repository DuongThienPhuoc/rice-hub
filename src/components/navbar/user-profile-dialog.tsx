import {
    Dialog,
    DialogContent, DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserProfileFormSchema } from '@/schema/user-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Phone, Lock } from 'lucide-react';
import { User as UserInterface } from '@/type/user';
import { Textarea } from '@/components/ui/textarea';
import { updateUserInformation } from '@/data/user';
import { User as UserType } from '@/type/user';

export default function UserProfileDialog({
    open,
    setOpen,
    user,
    fetchUserInformation,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    user: UserInterface;
    fetchUserInformation: () => Promise<void>;
}) {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const form = useForm<z.infer<typeof UserProfileFormSchema>>({
        resolver: zodResolver(UserProfileFormSchema),
        defaultValues: {
            fullName: user.name,
            phoneNumber: user.phone,
            userName: user.username,
            email: user.email,
            address: user.address,
        },
    });
    function handleEdit() {
        setIsEdit(!isEdit);
    }

    async function handleSave(values: z.infer<typeof UserProfileFormSchema>) {
        const userBody: UserType = {
            id: user.id,
            userType: user.userType,
            image: user.image,
            createdAt: user.createdAt,
            password: user.password,
            name: values.fullName,
            phone: values.phoneNumber,
            username: values.userName,
            email: values.email,
            address: values.address,
        }
        try {
            const response = await updateUserInformation(userBody);
            if (response.status === 200){
                setIsEdit(false);
                await fetchUserInformation();
            }else {
                console.error(response.data);
            }
        }catch (e) {
            console.error(e);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Thông tin cá nhân
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và Tên</FormLabel>
                                    <div className="relative">
                                        <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEdit}
                                                className="pl-8"
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên người dùng</FormLabel>
                                    <div className="relative">
                                        <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEdit}
                                                className="pl-8"
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <div className="relative">
                                        <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEdit}
                                                className="pl-8"
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <div>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                disabled={!isEdit}
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <Button type="button" onClick={handleEdit}>
                                {isEdit ? 'Huỷ' : 'Chỉnh sửa'}
                            </Button>
                            {isEdit && <Button>Lưu</Button>}
                        </div>
                        <div>
                            <Button type='button' className='w-full' variant='outline'>
                                <Lock className="mr-2 w-4 h-4" />
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
