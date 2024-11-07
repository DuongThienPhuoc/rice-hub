import { Package2 } from 'lucide-react';
import React from 'react';
import { AdminOrderResponse } from '@/type/order';

interface SummaryProps {
    adminOrderResponse: AdminOrderResponse;
}

const Summary: React.FC<SummaryProps> = ({ adminOrderResponse }) => {
    return (
        <section className="grid md:grid-cols-3">
            <div className="md:col-span-1 bg-white p-4 rounded space-y-4">
                <div className="flex items-center justify-between gap-1">
                    <h1 className="text-xl font-bold tracking-tight">Tổng đơn hàng</h1>
                    <Package2 className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">
                        {adminOrderResponse?.page?.totalElements}
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default Summary;
