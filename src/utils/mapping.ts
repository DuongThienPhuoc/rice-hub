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
        color: 'text-[#60a5fa]',
    },
    DISABLE_CATEGORY: {
        text: 'Vô hiệu hóa danh mục',
        color: 'text-[#f87171]',
    },
    ENABLE_CATEGORY: {
        text: 'Kích hoạt danh mục',
        color: 'text-[#34d399]',
    },
    UPDATE_CUSTOMER: {
        text: 'Cập nhật khách hàng',
        color: 'text-[#60a5fa]',
    },
    DISABLE_CUSTOMER: {
        text: 'Vô hiệu hóa khách hàng',
        color: 'text-[#f87171]',
    },
    ENABLE_CUSTOMER: {
        text: 'Kích hoạt khách hàng',
        color: 'text-[#34d399]',
    },
    DISABLE_EMPLOYEE: {
        text: 'Vô hiệu hóa nhân viên',
        color: 'text-[#f87171]',
    },
    ENABLE_EMPLOYEE: {
        text: 'Kích hoạt nhân viên',
        color: 'text-[#34d399]',
    },
    CONFIRM_ADD_TO_INVENTORY: {
        text: 'Xác nhận thêm vào kho',
        color: 'text-[#4ade80]',
    },
    CREATE_NEWS: {
        text: 'Tạo tin tức',
        color: 'text-[#4ade80]',
    },
    DISABLE_NEWS: {
        text: 'Vô hiệu hóa tin tức',
        color: 'text-[#f87171]',
    },
    ENABLE_NEWS: {
        text: 'Kích hoạt tin tức',
        color: 'text-[#34d399]',
    },
    UPDATE_NEWS: {
        text: 'Cập nhật tin tức',
        color: 'text-[#60a5fa]',
    },
    CREATE_ADMIN_ORDER: {
        text: 'Tạo đơn hàng quản trị',
        color: 'text-[#4ade80]',
    },
    CREATE_CUSTOMER_ORDER: {
        text: 'Tạo đơn hàng',
        color: 'text-[#4ade80]',
    },
    UPDATE_ADMIN_ORDER: {
        text: 'Cập nhật đơn hàng',
        color: 'text-[#60a5fa]',
    },
    UPDATE_CUSTOMER_ORDER: {
        text: 'Cập nhật đơn hàng',
        color: 'text-[#60a5fa]',
    },
    UPDATE_ADMIN_ORDER_DETAILS: {
        text: 'Cập nhật chi tiết đơn hàng',
        color: 'text-[#60a5fa]',
    },
    ADD_PRICE: {
        text: 'Thêm giá',
        color: 'text-[#4ade80]',
    },
    UPDATE_PRICE: {
        text: 'Cập nhật giá',
        color: 'text-[#60a5fa]',
    },
    UPDATE_CUSTOMER_PRICE: {
        text: 'Cập nhật giá khách hàng',
        color: 'text-[#60a5fa]',
    },
    UPDATE_PRICE_ADMIN: {
        text: 'Cập nhật giá',
        color: 'text-[#60a5fa]',
    },
    DELETE_PRICE: {
        text: 'Xóa giá',
        color: 'text-[#f87171]',
    },
    IMPORT_PRODUCT: {
        text: 'Nhập sản phẩm',
        color: 'text-[#4ade80]',
    },
    IMPORT_PRODUCT_PRODUCTION: {
        text: 'Nhập sản phẩm sản xuất',
        color: 'text-[#4ade80]',
    },
    CONFIRM_ADD_TO_WAREHOUSE: {
        text: 'Xác nhận thêm vào kho',
        color: 'text-[#4ade80]',
    },
    PREPARE_EXPORT_PRODUCT: {
        text: 'Chuẩn bị xuất sản phẩm',
        color: 'text-[#60a5fa]',
    },
    CONFIRM_EXPORT_PRODUCT: {
        text: 'Xác nhận xuất sản phẩm',
        color: 'text-[#34d399]',
    },
    CREATE_PRODUCT_ADMIN: {
        text: 'Tạo sản phẩm',
        color: 'text-[#4ade80]',
    },
    UPDATE_PRODUCT_CUSTOMER: {
        text: 'Cập nhật sản phẩm',
        color: 'text-[#60a5fa]',
    },
    DISABLE_PRODUCT: {
        text: 'Vô hiệu hóa sản phẩm',
        color: 'text-[#f87171]',
    },
    ENABLE_PRODUCT: {
        text: 'Kích hoạt sản phẩm',
        color: 'text-[#34d399]',
    },
    CREATE_PRODUCTION_ORDER: {
        text: 'Tạo đơn sản xuất',
        color: 'text-[#4ade80]',
    },
    UPDATE_PRODUCTION_ORDER: {
        text: 'Cập nhật đơn sản xuất',
        color: 'text-[#60a5fa]',
    },
    CANCEL_PRODUCTION_ORDER: {
        text: 'Hủy đơn sản xuất',
        color: 'text-[#f87171]',
    },
    DELETE_PRODUCTION_ORDER: {
        text: 'Xóa đơn sản xuất',
        color: 'text-[#f87171]',
    },
    CONFIRM_PRODUCTION_ORDER: {
        text: 'Xác nhận đơn sản xuất',
        color: 'text-[#34d399]',
    },
    UPDATE_PRODUCTION_ORDER_PRODUCT: {
        text: 'Cập nhật sản phẩm trong đơn sản xuất',
        color: 'text-[#60a5fa]',
    },
    DONE_PRODUCTION_ORDER: {
        text: 'Hoàn tất đơn sản xuất',
        color: 'text-[#34d399]',
    },
    CREATE_SUPPLIER: {
        text: 'Tạo nhà cung cấp',
        color: 'text-[#4ade80]',
    },
    UPDATE_SUPPLIER: {
        text: 'Cập nhật nhà cung cấp',
        color: 'text-[#60a5fa]',
    },
    DISABLE_SUPPLIER: {
        text: 'Vô hiệu hóa nhà cung cấp',
        color: 'text-[#f87171]',
    },
    ENABLE_SUPPLIER: {
        text: 'Kích hoạt nhà cung cấp',
        color: 'text-[#34d399]',
    },
    CREATE_TRANSACTION: {
        text: 'Tạo giao dịch',
        color: 'text-[#4ade80]',
    },
    CREATE_TRANSACTION_PAYOS: {
        text: 'Tạo giao dịch PayOS',
        color: 'text-[#4ade80]',
    },
    UPDATE_TRANSACTION: {
        text: 'Cập nhật giao dịch',
        color: 'text-[#60a5fa]',
    },
    CREATE_WAREHOUSE: {
        text: 'Tạo kho',
        color: 'text-[#4ade80]',
    },
    UPDATE_WAREHOUSE: {
        text: 'Cập nhật kho',
        color: 'text-[#60a5fa]',
    },
    DELETE_RECEIPT: {
        text: 'Xóa phiếu thu',
        color: 'text-[#f87171]',
    },
    CREATE_RECEIPT: {
        text: 'Tạo phiếu thu',
        color: 'text-[#4ade80]',
    },
    UPDATE_BATCH_PRODUCT: {
        text: 'Cập nhật lô sản phẩm',
        color: 'text-[#60a5fa]',
    },
    'UPDATE_ADMIN_ORDER-DETAILS':{
        text: 'Cập nhật chi tiết đơn hàng',
        color: 'text-[#60a5fa]',
    }
};

