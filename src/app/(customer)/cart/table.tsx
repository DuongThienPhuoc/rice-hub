'use client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import CartDialog from "@/app/(customer)/cart/dialog";
import {useProductSelectedStore} from '@/stores/cartStore'

export default function CartTable() {
    interface Product {
        id: number;
        name: string;
        type: string;
        quantity: number;
        price: number;
    }

    const products: Product[] = [
        {id: 1, name: 'Cám ST25', type: '50KG', quantity: 1, price: 100000},
        {id: 2, name: 'Cám ST24', type: '25KG', quantity: 2, price: 200000},
        {id: 3, name: 'Gạo Lứt', type: '50KG', quantity: 3, price: 300000},
        {id: 4, name: 'Gạo MT21', type: '25KG', quantity: 4, price: 400000},
    ]

    const selectedProduct = useProductSelectedStore(state => state.selected)
    const updateSelectedProduct = useProductSelectedStore(state => state.handleSelected)
    const updateSelectedAllProduct = useProductSelectedStore(state => state.handleSelectedAll)
    const totalMoney = useProductSelectedStore(state => state.total)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    return (
        <section className='grid gap-5'>
            <div className='bg-white p-3 rounded-lg'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox onCheckedChange={() => {
                                    updateSelectedAllProduct(products)
                                }}/>
                            </TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Thành tiền</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell><Checkbox
                                    checked={!!selectedProduct.find((selectedProduct) => selectedProduct.id === product.id)}
                                    onCheckedChange={() => updateSelectedProduct(product)}/></TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.type}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <section className='flex justify-end'>
                <div className='grid gap-5'>
                    <div className='flex justify-between gap-28 border-b border-[#E5E7EB]'>
                        <p className='font-semibold'>Tạm tính:</p>
                        <p>{totalMoney}</p>
                    </div>
                    <div className='flex justify-between gap-28 border-b border-[#E5E7EB]'>
                        <p className='font-semibold'>Giảm giá:</p>
                        <p>0</p>
                    </div>
                    <div className='flex justify-between gap-28 border-b border-[#E5E7EB]'>
                        <p className='font-semibold'>Thành tiền:</p>
                        <p className='font-semibold'>{totalMoney}</p>
                    </div>
                    <div>
                        <Button className='w-full' onClick={() => {
                            setDialogOpen(true)
                            console.log(selectedProduct)
                        }}>Đặt hàng</Button>
                    </div>
                </div>
            </section>
            <CartDialog open={dialogOpen} setOpen={setDialogOpen}/>
        </section>
    )
}