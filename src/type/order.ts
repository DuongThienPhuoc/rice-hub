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
