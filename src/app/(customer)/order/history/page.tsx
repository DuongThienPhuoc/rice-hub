import OrderTable from '@/app/(customer)/order/history/table';
import OrderSummary from '@/app/(customer)/order/history/order-summary';
import { cookies } from 'next/headers';

export default function OrderHistoryPage() {
    const cookieStore = cookies();
    const userID = cookieStore.get('userID');
    return (
        <section className="container mx-auto space-y-8">
            <OrderSummary />
            <OrderTable value={userID?.value}/>
        </section>
    );
}
