import OrderTable from '@/app/(customer)/order/history/table';
import OrderSummary from '@/app/(customer)/order/history/order-summary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function OrderHistoryPage() {
    const cookiesStorage = cookies();
    const userID = cookiesStorage.get('userID');
    if (!userID) {
        redirect('/login');
    }
    return (
        <section className="container mx-auto space-y-8">
            <OrderSummary />
            <OrderTable userID={userID.value} />
        </section>
    );
}
