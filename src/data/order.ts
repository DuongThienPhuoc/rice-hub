import axiosConfig from '@/api/axiosConfig';
import axios,{ AxiosResponse } from 'axios';

export interface Order {
    id: number;
    orderCode: string;
    orderDate: Date;
    totalAmount: number;
    deposit: number;
    remainingAmount: number;
    status: string;
}

export type OrderList = Order[];

export interface OrderRequest {
    customerId: number
    orderDetails: OrderDetail[]
}

export interface OrderDetail {
    productId: number
    quantity: number
    unitPrice: number
}

export async function getOrderHistory({ customerID }: { customerID: string }) {
    try {
        const response: AxiosResponse<OrderList> = await axiosConfig.get<OrderList>(
            `/order/history/${customerID}`,
        );
        return {
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Unexpected error occurred');
        }
        throw new Error('Something went wrong');
    }
}

export async function createOrder(order: OrderRequest) {
    try {
        const response = await axiosConfig.post('order/customer/CreateOrder', order);
        return {
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data.message;
            throw new Error(`Request failed with status ${status}: ${message}\``);
        }
        throw new Error('Something went wrong');
    }
}

export async function getOrderDetail(orderId: string){
    try {
        const response = await axiosConfig.get(`/order/details/${orderId}`);
        return {
            data: response.data,
            status: response.status
        }
    }catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data.message;
            throw new Error(`Request failed with status ${status}: ${message}\``);
        }
        throw new Error('Something went wrong');
    }
}

