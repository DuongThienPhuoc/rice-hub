import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userProfileFormSchema } from '@/schema/user-profile-schema';
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

export default function UserProfileDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const form = useForm<z.infer<typeof userProfileFormSchema>>({
        resolver: zodResolver(userProfileFormSchema),
        defaultValues: {
            fullName: 'John Doe',
            phoneNumber: '0829388273',
            userName: 'johndoe',
            email: 'johndoe@gmail.com',
        },
    });

    function handleEdit() {
        setIsEdit(!isEdit);
    }

    function handleSave(values: z.infer<typeof userProfileFormSchema>){
        console.log(values);
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Thông tin cá nhân
                    </DialogTitle>
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
