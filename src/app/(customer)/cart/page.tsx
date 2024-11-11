import CartTable from '@/app/(customer)/cart/table';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function CartPage() {
    const cookiesStorage = cookies();
    const customerID = cookiesStorage.get('userID');
    if (!customerID) {
        redirect('/login');
    }
    return (
        <section className="container mx-auto">
            <CartTable customerID={customerID.value} />
        </section>
    );
}
