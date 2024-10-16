import CartTable from "@/app/(customer)/cart/table";
import CartPageBreadcrumb from '@/app/(customer)/cart/breadcrumb';

export default function CartPage(){
    return (
        <section>
            <CartPageBreadcrumb/>
            <div>
                <CartTable/>
            </div>
        </section>
    )
}