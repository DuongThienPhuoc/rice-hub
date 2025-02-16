import axiosConfig from '@/config/axiosConfig';
import axios, { AxiosResponse } from 'axios';
import { AdminCreateImportRequest, AdminCreateOrderRequest, AdminUpdateOrderRequest } from '@/type/order';
import {
    CustomerOrderHistoryResponse,
    CustomerUpdateOrderRequest,
    OrderRequest,
} from '@/type/customer-order';

interface GetOrderHistoryProps {
    customerId?: string;
    orderCode?: string;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
}

export async function getOrderHistory({
    customerId,
    orderCode,
    status,
    pageSize,
    pageNumber,
}: GetOrderHistoryProps) {
    try {
        const response: AxiosResponse<CustomerOrderHistoryResponse> =
            await axiosConfig.get<CustomerOrderHistoryResponse>(
                `/order/customer/${customerId}`,
                {
                    params: {
                        orderCode,
                        status,
                        pageNumber,
                        pageSize,
                    },
                },
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
        const response = await axiosConfig.post(
            'order/customer/CreateOrder',
            order,
        );
        return {
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data.message;
            throw new Error(
                `Request failed with status ${status}: ${message}\``,
            );
        }
        throw new Error('Something went wrong');
    }
}

export async function getOrderDetail(orderId: string) {
    try {
        const response = await axiosConfig.get(`/order/details/${orderId}`);
        return {
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data.message;
            throw new Error(
                `Request failed with status ${status}: ${message}\``,
            );
        }
        throw new Error('Something went wrong');
    }
}

export async function getAdminOrders<T>(
    pageNumber: number = 1,
    pageSize: number = 10,
    orderStatus: string | undefined
): Promise<T> {
    try {
        if(orderStatus === 'ALL') {
            orderStatus = undefined;
        }
        console.log({
            pageNumber,
            pageSize,
            status: orderStatus
        });
        const response: AxiosResponse<T> = await axiosConfig.get(
            `/order/admin/orders`,{
                params: {
                    pageNumber,
                    pageSize,
                    status: orderStatus
                }
        });
        return response.data;
    } catch (e) {
        console.error('Error fetching admin orders', e);
        throw e;
    }
}

export async function adminCreateOrder(order: AdminCreateOrderRequest) {
    try {
        return await axiosConfig.post('/order/admin/CreateOrder', order, {
            validateStatus: (status) => status < 500,
        });
    } catch (e) {
        throw e;
    }
}

export async function adminCreateImport(order: AdminCreateImportRequest) {
    try {
        const response = await axiosConfig.post('products/generateTemplate', order, {
            responseType: 'arraybuffer',
            validateStatus: (status) => status < 500,
        });
        return response;
    } catch (error) {
        throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    }
}

export async function adminUpdateOrder(
    order: AdminUpdateOrderRequest,
    orderId: number,
) {
    try {
        return await axiosConfig.post(
            `/order/admin/UpdateOrder/${orderId}`,
            order,
            {
                validateStatus: (status) => status < 500,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function customerUpdateOrder(
    orderId: number,
    order: CustomerUpdateOrderRequest,
) {
    try {
        return await axiosConfig.post(
            `/order/customer/UpdateOrder/${orderId}`,
            order,
        );
    } catch (e) {
        throw e;
    }
}

export async function adminUpdateOrderQuantity(
    order: AdminUpdateOrderRequest,
    orderId: number,
) {
    try {
        return await axiosConfig.post(
            `/order/admin/UpdateOrderDetail/${orderId}`,
            order,
        );
    } catch (e) {
        throw e;
    }
}
