'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomerOrderHistoryResponse } from '@/type/customer-order';
import { getOrderHistory } from '@/data/order';
import { currencyHandleProvider } from '@/utils/currency-handle';

export default function OrderSummary({ userID }: { userID: string }) {
    const [customerOrderHistoryResponse, setCustomerOrderHistoryResponse] =
        useState<CustomerOrderHistoryResponse>(
            {} as CustomerOrderHistoryResponse,
        );
    useEffect(() => {
        getOrderHistory({ customerId: userID }).then((response) => {
            setCustomerOrderHistoryResponse(response.data);
        });
    }, [userID]);
    const totalAmount =
        customerOrderHistoryResponse?._embedded?.orderList.filter((order) => order.status === 'COMPLETED').reduce(
            (acc, order) => acc + order.totalAmount,
            0,
        );

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                        Tổng Đơn hàng
                    </CardTitle>
                    <Package className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {customerOrderHistoryResponse.page?.totalElements}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                        Số tiền đã chi
                    </CardTitle>
                    <Banknote className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {currencyHandleProvider(totalAmount || 0)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
