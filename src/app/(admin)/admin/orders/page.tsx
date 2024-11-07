'use client';

import React, { useState, useEffect } from 'react';
import AdminOrdersTable from '@/app/(admin)/admin/orders/table';
import { AdminOrderResponse } from '@/type/order';
import { getAdminOrders } from '@/data/order';
import Summary from '@/app/(admin)/admin/orders/summary';
import Skeleton from '@/app/(admin)/admin/orders/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AdminOrdersPageBreadcrumb from '@/app/(admin)/admin/orders/breadcrumb';

const AdminOrdersPage: React.FC = () => {
    const [adminOrderResponse, setAdminOrderResponse] =
        useState<AdminOrderResponse>();
    const [newOrder, setNewOrder] = useState<boolean>(false);
    useEffect(() => {
        getAdminOrders<AdminOrderResponse>()
            .then((response) => setAdminOrderResponse(response))
            .catch((error) => console.error(error));
    }, [newOrder]);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <AdminOrdersPageBreadcrumb />
            </header>
            <section className="container mx-auto space-y-4">
                {adminOrderResponse ? (
                    <>
                        <Summary adminOrderResponse={adminOrderResponse} />
                        <AdminOrdersTable adminOrderResponse={adminOrderResponse} newOrder={newOrder}
                                          setNewOrder={setNewOrder} />
                    </>
                ) : (
                    <Skeleton />
                )}
            </section>
        </>
    );
};

export default AdminOrdersPage;
