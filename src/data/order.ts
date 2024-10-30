import axios from '@/api/axiosConfig';

export interface Order {
    id: number;
    orderCode: string;
    orderDate: Date;
    totalAmount: number;
    deposit: number;
    remainingAmount: number;
    status: string;
}

type OrderList = Order[];

export async function getOrderHistory({
    customerID,
}: {
    customerID: number;
}): Promise<OrderList | undefined> {
    try {
        const response = await axios.get<OrderList>(
            `/orders/history/${customerID}`,
        );
        return response.data;
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return []
    }
}
