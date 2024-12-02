type StatusProvider = {
    text: string;
    variant:
        | 'default'
        | 'destructive'
        | 'secondary'
        | 'outline'
        | null
        | undefined;
};

export function statusProvider(status: string): StatusProvider {
    switch (status) {
        case 'PENDING':
            return { text: 'Chờ xác nhận', variant: 'default' };
        case 'CANCELED':
            return { text: 'Đã hủy', variant: 'destructive' };
        case 'FAILED':
            return { text: 'Thất bại', variant: 'destructive' };
        case 'COMPLETED':
            return { text: 'Hoàn thành', variant: 'secondary' };
        case 'IN_PROCESS':
            return { text: 'Đang xử lý', variant: 'secondary' };
        case 'COMPLETE':
            return { text: 'Đã nhận hàng', variant: 'secondary' };
        case 'CONFIRMED':
            return { text: 'Đã xác nhận', variant: 'secondary' };
        default:
            return { text: 'Không xác định', variant: 'default' };
    }
}
