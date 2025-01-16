type ActivityInfor = {
    text: string;
    color: string;
};
export const mappingActivity: Record<string, ActivityInfor> = {
    CREATE_CATEGORY: {
        text: 'Tạo danh mục',
        color: '#4ade80',
    },
    UPDATE_CATEGORY: {
        text: 'Cập nhật danh mục',
        color: '#60a5fa',
    },
    DISABLE_CATEGORY: {
        text: 'Vô hiệu hóa danh mục',
        color: '#f87171',
    },
    ENABLE_CATEGORY: {
        text: 'Kích hoạt danh mục',
        color: '#34d399',
    },
    UPDATE_CUSTOMER: {
        text: 'Cập nhật khách hàng',
        color: '#60a5fa',
    },
    DISABLE_CUSTOMER: {
        text: 'Vô hiệu hóa khách hàng',
        color: '#f87171',
    },
    ENABLE_CUSTOMER: {
        text: 'Kích hoạt khách hàng',
        color: '#34d399',
    },
    DISABLE_EMPLOYEE: {
        text: 'Vô hiệu hóa nhân viên',
        color: '#f87171',
    },
    ENABLE_EMPLOYEE: {
        text: 'Kích hoạt nhân viên',
        color: '#34d399',
    },
    CONFIRM_ADD_TO_INVENTORY: {
        text: 'Xác nhận thêm vào kho',
        color: '#4ade80',
    },
    CREATE_NEWS: {
        text: 'Tạo tin tức',
        color: '#4ade80',
    },
    DISABLE_NEWS: {
        text: 'Vô hiệu hóa tin tức',
        color: '#f87171',
    },
    ENABLE_NEWS: {
        text: 'Kích hoạt tin tức',
        color: '#34d399',
    },
    UPDATE_NEWS: {
        text: 'Cập nhật tin tức',
        color: '#60a5fa',
    },
    CREATE_ADMIN_ORDER: {
        text: 'Tạo đơn hàng quản trị',
        color: '#4ade80',
    },
    CREATE_CUSTOMER_ORDER: {
        text: 'Tạo đơn hàng',
        color: '#4ade80',
    },
    UPDATE_ADMIN_ORDER: {
        text: 'Cập nhật đơn hàng',
        color: '#60a5fa',
    },
    UPDATE_CUSTOMER_ORDER: {
        text: 'Cập nhật đơn hàng',
        color: '#60a5fa',
    },
    UPDATE_ADMIN_ORDER_DETAILS: {
        text: 'Cập nhật chi tiết đơn hàng',
        color: '#60a5fa',
    },
    ADD_PRICE: {
        text: 'Thêm giá',
        color: '#4ade80',
    },
    UPDATE_PRICE: {
        text: 'Cập nhật giá',
        color: '#60a5fa',
    },
    UPDATE_CUSTOMER_PRICE: {
        text: 'Cập nhật giá khách hàng',
        color: '#60a5fa',
    },
    UPDATE_PRICE_ADMIN: {
        text: 'Cập nhật giá',
        color: '#60a5fa',
    },
    DELETE_PRICE: {
        text: 'Xóa giá',
        color: '#f87171',
    },
    IMPORT_PRODUCT: {
        text: 'Nhập sản phẩm',
        color: '#4ade80',
    },
    IMPORT_PRODUCT_PRODUCTION: {
        text: 'Nhập sản phẩm sản xuất',
        color: '#4ade80',
    },
    CONFIRM_ADD_TO_WAREHOUSE: {
        text: 'Xác nhận thêm vào kho',
        color: '#4ade80',
    },
    PREPARE_EXPORT_PRODUCT: {
        text: 'Chuẩn bị xuất sản phẩm',
        color: '#60a5fa',
    },
    DELETE_BATCH_PRODUCT: {
        text: 'Xóa sản phẩm trong lô hàng',
        color: '#f87171',
    },
    CONFIRM_EXPORT_PRODUCT: {
        text: 'Xác nhận xuất sản phẩm',
        color: '#34d399',
    },
    CREATE_PRODUCT_ADMIN: {
        text: 'Tạo sản phẩm',
        color: '#4ade80',
    },
    UPDATE_PRODUCT_CUSTOMER: {
        text: 'Cập nhật sản phẩm',
        color: '#60a5fa',
    },
    DISABLE_PRODUCT: {
        text: 'Vô hiệu hóa sản phẩm',
        color: '#f87171',
    },
    ENABLE_PRODUCT: {
        text: 'Kích hoạt sản phẩm',
        color: '#34d399',
    },
    CREATE_PRODUCTION_ORDER: {
        text: 'Tạo đơn sản xuất',
        color: '#4ade80',
    },
    UPDATE_PRODUCTION_ORDER: {
        text: 'Cập nhật đơn sản xuất',
        color: '#60a5fa',
    },
    CANCEL_PRODUCTION_ORDER: {
        text: 'Hủy đơn sản xuất',
        color: '#f87171',
    },
    DELETE_PRODUCTION_ORDER: {
        text: 'Xóa đơn sản xuất',
        color: '#f87171',
    },
    CONFIRM_PRODUCTION_ORDER: {
        text: 'Xác nhận đơn sản xuất',
        color: '#34d399',
    },
    UPDATE_PRODUCTION_ORDER_PRODUCT: {
        text: 'Cập nhật sản phẩm trong đơn sản xuất',
        color: '#60a5fa',
    },
    DONE_PRODUCTION_ORDER: {
        text: 'Hoàn tất đơn sản xuất',
        color: '#34d399',
    },
    CREATE_SUPPLIER: {
        text: 'Tạo nhà sản xuất',
        color: '#4ade80',
    },
    UPDATE_SUPPLIER: {
        text: 'Cập nhật nhà sản xuất',
        color: '#60a5fa',
    },
    DISABLE_SUPPLIER: {
        text: 'Vô hiệu hóa nhà sản xuất',
        color: '#f87171',
    },
    ENABLE_SUPPLIER: {
        text: 'Kích hoạt nhà sản xuất',
        color: '#34d399',
    },
    CREATE_TRANSACTION: {
        text: 'Tạo giao dịch',
        color: '#4ade80',
    },
    CREATE_TRANSACTION_PAYOS: {
        text: 'Tạo giao dịch PayOS',
        color: '#4ade80',
    },
    UPDATE_TRANSACTION: {
        text: 'Cập nhật giao dịch',
        color: '#60a5fa',
    },
    CREATE_WAREHOUSE: {
        text: 'Tạo kho',
        color: '#4ade80',
    },
    UPDATE_WAREHOUSE: {
        text: 'Cập nhật kho',
        color: '#60a5fa',
    },
    DELETE_RECEIPT: {
        text: 'Xóa phiếu thu',
        color: '#f87171',
    },
    CREATE_RECEIPT: {
        text: 'Tạo phiếu thu',
        color: '#4ade80',
    },
    UPDATE_BATCH_PRODUCT: {
        text: 'Cập nhật lô sản phẩm',
        color: '#60a5fa',
    },
    'UPDATE_ADMIN_ORDER-DETAILS': {
        text: 'Cập nhật chi tiết đơn hàng',
        color: '#60a5fa',
    },
    IMPORT_PRODUCT_EXCEL: {
        text: 'Nhập sản phẩm bằng excel',
        color: '#60a5fa',
    },
    EXPORT_PRODUCT_EXCEL: {
        text: 'Xuất sản phẩm bằng excel',
        color: '#60a5fa',
    },
};

export const mappingRole: Record<string, string> = {
    DRIVER: 'Lái xe',
    PORTER: 'Nhân viên bốc/dỡ hàng',
    WAREHOUSE_MANAGER: 'Nhân viên quản kho',
};

