type StatusProvider = {
    text: string;
    variant:
        | 'default'
        | 'destructive'
        | 'secondary'
        | 'outline'
        | null
        | undefined;
    textColor: string;
    bgColor: string;
};

export function statusProvider(status: string): StatusProvider {
    switch (status) {
        case 'PENDING':
            return {
                text: 'Chờ xác nhận',
                variant: 'default',
                textColor: '#FF8C00', // vàng
                bgColor: '#FFEB99'   // nền vàng nhạt
            };
        case 'CANCELED':
            return {
                text: 'Đã hủy',
                variant: 'destructive',
                textColor: '#FF4500', // đỏ cam
                bgColor: '#FFE4E1'   // nền đỏ nhạt
            };
        case 'FAILED':
            return {
                text: 'Thất bại',
                variant: 'destructive',
                textColor: '#DC143C', // đỏ
                bgColor: '#F08080'   // nền đỏ nhạt
            };
        case 'COMPLETED':
            return {
                text: 'Hoàn thành',
                variant: 'secondary',
                textColor: '#228B22', // xanh lá
                bgColor: '#90EE90'   // nền xanh nhạt
            };
        case 'IN_PROCESS':
            return {
                text: 'Đang xử lý',
                variant: 'secondary',
                textColor: '#1E90FF', // xanh dương
                bgColor: '#B0E0E6'   // nền xanh nhạt
            };
        case 'COMPLETE':
            return {
                text: 'Đã nhận hàng',
                variant: 'secondary',
                textColor: '#4682B4', // xanh dương đậm
                bgColor: '#ADD8E6'   // nền xanh nhạt
            };
        case 'CONFIRMED':
            return {
                text: 'Đã xác nhận',
                variant: 'secondary',
                textColor: '#006400', // xanh lá đậm
                bgColor: '#98FB98'   // nền xanh nhạt
            };
        default:
            return {
                text: 'Không xác định',
                variant: 'default',
                textColor: '#808080', // xám
                bgColor: '#D3D3D3'   // nền xám nhạt
            };
    }
}
