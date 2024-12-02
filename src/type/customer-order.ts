export interface CustomerOrderHistoryResponse {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}

export interface OrderRequest {
    customerId: number;
    orderPhone: string;
    orderAddress: string;
    orderDetails: OrderDetail[];
}

interface Embedded {
    orderList: Order[];
}

interface OrderDetail {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: number;
    orderCode: string;
    orderDate: Date;
    totalAmount: number;
    deposit: number;
    remainingAmount: number;
    status: string;
}

interface Links {
    self: Self;
}

interface Self {
    href: string;
}

interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface CustomerUpdateOrderRequest {
    customerId: number
    status: string
    totalAmount: number
    deposit: number
    remainingAmount: number
    orderPhone: string
    orderAddress: string
    orderDetails: CustomerUpdateOrderRequestOrderDetail[]
}

interface CustomerUpdateOrderRequestOrderDetail {
    productId: number
    name: string
    description: string
    quantity: number
    unitPrice: number
    weightPerUnit: number
    productUnit: string
    discount: number
    totalPrice: number
}
