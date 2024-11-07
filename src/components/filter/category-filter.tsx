import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React from 'react';

export default function CategoryFilter() {
    interface ProductCategory {
        id: number;
        name: string;
    }

    const category: Array<ProductCategory> = [
        { id: 1, name: 'Cám' },
        { id: 2, name: 'Cám cp' },
        { id: 3, name: 'Đỗ' },
        { id: 4, name: 'Gạo rượu' },
        { id: 5, name: 'Men rượu' },
    ];

    function handleSearchCategory() {
        // Search category
    }

    return (
        <section className="bg-white p-3 rounded-lg flex flex-col gap-y-2">
            <div className="flex justify-between text-[16px] font-bold">
                <h1>Nhóm hàng</h1>
                <span>
                    <ChevronDown />
                </span>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2  h-4 w-4 text-gray-500" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm nhóm hàng"
                    className="pl-9"
                    onChange={handleSearchCategory}
                />
            </div>
            <div>
                <ul>
                    {category.map((category) => (
                        <li
                            key={category.id}
                            className="p-2 font-normal hover:bg-gray-100 cursor-pointer"
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
