import CartTable from "@/app/(customer)/cart/table";

export default function CartPage(){
    return (
        <section>
            <div>
                <h1 className='font-bold text-[18px] py-5'>Giỏ hàng</h1>
            </div>
            <div>
                <CartTable/>
            </div>
        </section>
    )
}