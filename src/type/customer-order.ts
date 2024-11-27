export interface CustomerOrderHistoryResponse {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}

export interface OrderRequest {
    customerId: number;
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
