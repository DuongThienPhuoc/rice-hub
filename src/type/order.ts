export interface AdminOrderResponse {
    _embedded: Embedded;
    _links:    Links;
    page:      Page;
}

export interface AdminUpdateOrderRequest {
    customerId:      number;
    status:          string;
    totalAmount:     number;
    deposit:         number;
    remainingAmount: number;
    orderDetails:    OrderDetail[];
}

export interface Order {
    id:              number;
    orderCode:       string;
    customer:        Customer;
    orderDate:       string;
    orderPhone:      string;
    orderAddress:    string;
    totalAmount:     number;
    deposit:         number;
    remainingAmount: number;
    status:          string;
    orderDetails:    OrderDetail[];
    receiptVoucher:  ReceiptVoucher;
}

export interface ReceiptVoucher {
    id:           number;
    receiptCode:  string;
    receiptDate:  Date;
    dueDate:      null;
    totalAmount:  number;
    paidAmount:   number;
    remainAmount: number;
    transactions: Transaction[];
}

export interface Transaction {
    id:              number;
    amount:          number;
    transactionDate: Date;
    paymentMethod:   string;
    status:          string;
}

export interface Embedded {
    orderList: Order[];
}

export interface OrderDetail {
    productId: number;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    weightPerUnit: number;
    productUnit: string;
    discount: number;
    totalPrice: number;
}

export interface Customer {
    id:        number;
    fullName:  string;
    image:     null | string;
    username:  string;
    password:  string;
    phone:     string;
    email:     string;
    address:   string;
    createAt:  Date;
    updateAt:  Date | null;
    active:    boolean;
    userType:  string;
    dob:       Date;
    gender:    boolean;
    name:      string;
    contracts: Contract[];
    supporter: boolean;
}

export interface Contract {
    id:               number;
    contractNumber:   string;
    contractTime:     Date;
    amount:           number;
    pdfFilePath:      string;
    imageFilePath:    string;
    confirmed:        boolean;
    confirmationDate: Date;
}

export interface OrderDetail {
    id:            number;
    product:       ProductClass | number;
    quantity:      number;
    discount:      number;
    productUnit:   string;
    weightPerUnit: number;
    unitPrice:     number;
    totalPrice:    number;
}

export interface ProductClass {
    id:                number;
    name:              string;
    description:       string;
    price:             number;
    image:             string;
    productCode:       string;
    supplier:          Supplier;
    category:          Category;
    unitOfMeasure:     UnitOfMeasure;
    createAt:          Date;
    updateAt:          Date;
    isDeleted:         boolean;
    productWarehouses: ProductWarehouse[];
    batchProducts:     BatchProduct[];
    importPrice:       number;
}

export interface BatchProduct {
    id:            number;
    quantity:      number;
    price:         number;
    weight:        number;
    weightPerUnit: number;
    unit:          string;
    description:   string;
    product:       number;
    discount:      Discount;
}

export interface Discount {
    id:            number;
    description:   string;
    amountPerUnit: number;
    startDate:     Date;
    endDate:       Date;
    active:        boolean;
}

export interface Category {
    id:          number;
    name:        string;
    description: string;
    active:      boolean;
}

export interface ProductWarehouse {
    id:            number;
    quantity:      number;
    batchCode:     string;
    importPrice:   number;
    sellPrice:     number;
    weight:        number;
    weightPerUnit: number;
    unit:          string;
    product:       number;
    warehouse:     Warehouse;
}

export interface Warehouse {
    id:       number;
    name:     string;
    location: Location;
}

export interface Supplier {
    id:            number;
    name:          string;
    contactPerson: string;
    email:         string;
    phoneNumber:   string;
    address:       string;
    active:        boolean;
}

export interface UnitOfMeasure {
    id:               number;
    unitName:         string;
    conversionFactor: number;
}

export interface Links {
    self: Self;
}

export interface Self {
    href: string;
}

export interface Page {
    size:          number;
    totalElements: number;
    totalPages:    number;
    number:        number;
}

export interface ProductOrderRequest {
    productId?: number;
    name?: string;
    quantity?: number;
    unitPrice?: number
    weightPerUnit?: number;
    productUnit?: string;
}

export interface AdminCreateOrderRequest {
    customerId: number;
    orderDetails: ProductOrderRequest[];
}