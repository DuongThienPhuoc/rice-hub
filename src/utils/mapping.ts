type ActivityInfor = {
    text: string;
    color: string;
};
export const mappingActivity: Record<string, ActivityInfor> = {
    CREATE_CATEGORY: {
        text: 'Tạo danh mục',
        color: 'text-[#4ade80]',
    },
    UPDATE_CATEGORY: {
        text: 'Cập nhật danh mục',
        color: 'text-[#facc15]',
    },
    DELETE_CATEGORY: {
        text: 'Xóa danh mục',
        color: 'text-[#f87171]',
    },
    CREATE_ADMIN_ORDER: {
        text: 'Tạo đơn hàng',
        color: 'text-[#4ade80]',
    },
    UPDATE_ADMIN_ORDER: {
        text: 'Cập nhật đơn hàng',
        color: 'text-[#facc15]',
    },
    DELETE_ADMIN_ORDER: {
        text: 'Xóa đơn hàng',
        color: 'text-[#f87171]',
    },
    CREATE_CUSTOMER_ORDER: {
        text: 'Tạo đơn hàng',
        color: 'text-[#4ade80]',
    },
    UPDATE_CUSTOMER_ORDER: {
        text: 'Cập nhật đơn hàng',
        color: 'text-[#facc15]',
    },
    DELETE_CUSTOMER_ORDER: {
        text: 'Xóa đơn hàng',
        color: 'text-[#f87171]',
    },
};
