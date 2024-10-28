import OrderTable from '@/app/(customer)/order/history/table';
import OrderSummary from '@/app/(customer)/order/history/order-summary';

export default function OrderHistoryPage() {
    return (
        <section className="container mx-auto space-y-8">
            <OrderSummary />
            <OrderTable />
        </section>
    );
}
