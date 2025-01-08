import React, { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UnitWeightPairsList } from '@/data/customer-product';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type OrderPopoverProviderProps = {
    children: React.ReactNode;
    unitWeightPairsList: UnitWeightPairsList[];
    type: string;
    setType: (type: string) => void;
    setProductUnit: (productUnit: string) => void;
    quantity: number;
    setQuantity: (quantity: number) => void;
    addProductToOrder: () => void;
};

const OrderPopoverProvider: React.FC<OrderPopoverProviderProps> = ({
    children,
    unitWeightPairsList,
    type,
    setType,
    setProductUnit,
    quantity,
    setQuantity,
    addProductToOrder,
}) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');
    const [error2, setError2] = React.useState<string>('');

    function handleSubmit() {
        if (type === '') {
            setError('Vui lòng chọn quy cách');
        }
        else if (quantity === 0) {
            setError('Số lượng không được để trống');
        }
        else {
            setType('');
            setQuantity(1);
            setError('');
            addProductToOrder();
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (isOpen == false) {
            setNewWeight('');
            setNewUnit('');
            setIsAdding(false)
        }
    }, [isOpen])

    const [isAdding, setIsAdding] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [newUnit, setNewUnit] = useState('');

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Quy cách</h4>
                        <p className="text-sm text-muted-foreground">
                            Vui lòng chọn quy cách cho sản phẩm
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="type">Quy cách đóng gói</Label>
                            <Select onValueChange={(value) => {
                                const weightPerUnit: UnitWeightPairsList = JSON.parse(value)
                                setType(weightPerUnit.weightPerUnit.toString())
                                setProductUnit(weightPerUnit.productUnit)
                            }}>
                                <SelectTrigger id="type" className="w-[165px]">
                                    <SelectValue placeholder="Chọn quy cách" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Quy cách</SelectLabel>
                                        {unitWeightPairsList.map(
                                            (weightPerUnit, _index) => (
                                                <SelectItem
                                                    value={JSON.stringify(weightPerUnit)}
                                                    key={_index}
                                                >
                                                    {`${weightPerUnit.productUnit} ${weightPerUnit.weightPerUnit} KG`}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="quantity">Số lượng</Label>
                            <Input
                                id="quantity"
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(parseInt(event.target.value))
                                }
                                type="number"
                                min={1}
                                className="col-span-2 h-8 w-[165px]"
                            />
                        </div>
                        <div>
                            {error && (
                                <div className='p-1 bg-destructive text-white text-sm font-semibold text-center rounded'>
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => setIsAdding(true)}
                        >
                            Nhập quy cách mới
                        </Button>
                        {isAdding && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded shadow-lg w-[300px]">
                                    <select
                                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                                        value={newUnit}
                                        onChange={(e) => {
                                            setNewUnit(e.target.value)
                                            setProductUnit(e.target.value)
                                        }}
                                    >
                                        <option value="" disabled>Chọn quy cách</option>
                                        <option value="BAO">BAO</option>
                                        <option value="TÚI">TÚI</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Nhập trọng lượng (kg)"
                                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                                        value={newWeight}
                                        onChange={(e) => {
                                            setType(e.target.value)
                                            setNewWeight(e.target.value)
                                        }}
                                    />
                                    <Input
                                        id="quantity"
                                        value={quantity}
                                        onChange={(event) =>
                                            setQuantity(parseInt(event.target.value))
                                        }
                                        type="number"
                                        min={1}
                                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    />
                                    <div>
                                        {error2 && (
                                            <div className='mb-4 p-1 bg-destructive text-white text-sm font-semibold text-center rounded'>
                                                <span>{error2}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            className="bg-red-600 hover:bg-red-500"
                                            onClick={() => {
                                                setError2("")
                                                setError("")
                                                setNewUnit("")
                                                setNewWeight("")
                                                setIsAdding(false)
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            className="bg-blue-500 hover:bg-blue-600"
                                            onClick={() => {
                                                if (newUnit === '') {
                                                    setError2('Vui lòng chọn quy cách');
                                                }
                                                else if (newWeight === '') {
                                                    setError2('Vui lòng nhập trọng lượng cho quy cách');
                                                }
                                                else if (quantity === 0) {
                                                    setError2('Số lượng không được để trống');
                                                } else {
                                                    setError2('');
                                                    handleSubmit()
                                                }
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            <Button className="w-full" onClick={handleSubmit}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default OrderPopoverProvider;
