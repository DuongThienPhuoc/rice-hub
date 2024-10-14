'use client'
import {ChevronDown, Search, ShoppingCart} from 'lucide-react'
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import OrderPageDialog from "@/components/employee/order-page/dialog";
import {ChangeEvent, useState} from "react";


export default function OrderPage() {
    interface ProductCategory {
        id: number,
        name: string
    }

    const productCategories: Array<ProductCategory> = [
        {id: 1, name: 'Cám con cò'},
        {id: 2, name: 'Cám cp'},
        {id: 3, name: 'Đỗ'},
        {id: 4, name: 'Gạo rượu'},
        {id: 5, name: 'Men rượu'},
    ]

    interface Product {
        id: string,
        name: string,
        unit: 'kg' | 'ton',
        price: number,
        type: number[]
    }

    const products: Array<Product> = [
        {id: 'SP001', name: 'Cám con cò 1', unit: 'kg', price: 10000, type: [10,25,50]},
        {id: 'SP002', name: 'Cám con cò 2', unit: 'kg', price: 20000, type: [10,25,50]},
        {id: 'SP003', name: 'Cám con cò 3', unit: 'kg', price: 30000, type: [10,25,50]},
        {id: 'SP004', name: 'Cám cp 1', unit: 'kg', price: 40000, type: [10,25,50]},
        {id: 'SP005', name: 'Cám cp 2', unit: 'kg', price: 50000, type: [10,25,50]}
    ]

    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState(productCategories)
    const [productType, setProductType] = useState<number[]>([])

    function handleSearchCategory(e: ChangeEvent<HTMLInputElement>) {
        setCategory(productCategories.filter(category => category.name.toLowerCase().includes(e.target.value.toLowerCase())))
    }

    return (
        <section className='mt-10'>
            <div className='container mx-auto grid grid-cols-5 gap-x-2'>
                <section>
                    <section className='bg-white p-3 rounded-lg flex flex-col gap-y-2'>
                        <div className='flex justify-between text-[16px] font-bold'>
                            <h1>Nhóm hàng</h1>
                            <span><ChevronDown/></span>
                        </div>
                        <div className='relative'>
                            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2  h-4 w-4 text-gray-500'/>
                            <Input type='text' placeholder='Tìm kiếm nhóm hàng' className='pl-9'
                                   onChange={handleSearchCategory}/>
                        </div>
                        <div>
                            <ul>
                                {category.map((category) => (
                                    <li key={category.id}
                                        className='p-2 font-normal hover:bg-gray-100 cursor-pointer'>{category.name}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </section>
                <section className='col-span-4'>
                    <section className='bg-white p-3 rounded-lg'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã hàng hoá</TableHead>
                                    <TableHead>Tên hàng hoá</TableHead>
                                    <TableHead>Đơn vị</TableHead>
                                    <TableHead>Đơn giá</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className='font-medium'>{product.id}</TableCell>
                                        <TableCell className='hover:cursor-pointer'>{product.name}</TableCell>
                                        <TableCell>{product.unit}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            <span>
                                                <ShoppingCart onClick={() => {
                                                    setOpen(true)
                                                    setPrice(product.price)
                                                    setProductType(product.type)
                                                }} className='h-4 w-4 hover:cursor-pointer'/>
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                </section>
            </div>
            <OrderPageDialog open={open} onOpenChange={setOpen} price={price} type={productType}/>
        </section>
    );
}