import {Dispatch, SetStateAction} from "react";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";

export default function CartDialog({open,setOpen}:{open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}){
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='bg-white'>
                <DialogTitle>Thông báo</DialogTitle>
                <DialogDescription>Đơn hàng của bạn đã được ghi nhận thành công lên hệ thống, nhân viên chúng tôi sẽ liên hệ bạn sớm nhất</DialogDescription>
            </DialogContent>
        </Dialog>
    )
}