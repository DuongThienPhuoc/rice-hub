'use client';

import React, { useState, useEffect } from 'react';
import AdminOrdersTable from '@/app/(admin)/admin/orders/table';
import { AdminOrderResponse } from '@/type/order';
import { getAdminOrders } from '@/data/order';
import Summary from '@/app/(admin)/admin/orders/summary';
import Skeleton from '@/app/(admin)/admin/orders/skeleton';

const AdminOrdersPage: React.FC = () => {
    const [adminOrderResponse, setAdminOrderResponse] =
        useState<AdminOrderResponse>();
    const [newOrder, setNewOrder] = useState<boolean>(false);
    const [refreshData, setRefreshData] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    useEffect(() => {
        getAdminOrders<AdminOrderResponse>(currentPage + 1, 5)
            .then((response) => {
                setAdminOrderResponse(response)
                setTotalPage(response.page.totalPages)
            })
            .catch((error) => console.error(error));
    }, [newOrder, refreshData, currentPage]);

    return (
        <>
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
