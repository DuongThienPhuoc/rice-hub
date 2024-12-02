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
    const [refreshData, setRefreshData] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    useEffect(() => {
        getAdminOrders<AdminOrderResponse>(currentPage + 1,5)
            .then((response) => {
                setAdminOrderResponse(response)
                setTotalPage(response.page.totalPages)
            })
            .catch((error) => console.error(error));
    }, [newOrder, refreshData, currentPage]);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5 bg-[#0090d9]">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <AdminOrdersPageBreadcrumb />
            </header>
            <section className="container mx-auto space-y-4">
                {adminOrderResponse ? (
                    <>
                        <Summary adminOrderResponse={adminOrderResponse} />
                        <AdminOrdersTable
                            adminOrderResponse={adminOrderResponse}
                            newOrder={newOrder}
                            setNewOrder={setNewOrder}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPage={totalPage}
                        />
                    </>
                ) : (
                    <Skeleton />
                )}
            </section>
        </>
    );
};

export default AdminOrdersPage;
