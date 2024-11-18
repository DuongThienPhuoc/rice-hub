export interface ExpenseVoucherResponse {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}

export interface CreateExpenseVoucherRequest {
    type: string,
    totalAmount: number,
    note: string,
}

export interface Embedded {
    expenseVoucherDtoList: ExpenseVoucher[];
}

export interface ExpenseVoucher {
    id: number;
    expenseCode: string;
    expenseDate: Date;
    totalAmount: number;
    note: string;
    type: string;
    warehouseReceiptDto: WarehouseReceiptDto;
    employeeDTO: EmployeeDTO;
    deleted: boolean;
}

export interface EmployeeDTO {
    id: number;
    phone: null;
    email: null;
    address: null;
    fullName: null;
    bankName: null;
    bankNumber: null;
    dob: null;
    gender: boolean;
    image: null;
    employeeRoleId: null;
}

export interface WarehouseReceiptDto {
    id: number;
    receiptDate: null;
    receiptType: null;
    document: null;
    batchCode: null;
    username: null;
}

export interface Links {
    self: Self;
}

export interface Self {
    href: string;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
