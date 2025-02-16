import React from 'react';
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
    const [warehouseQuantity, setWarehouseQuantity] = React.useState<number>(0);
    function handleSubmit() {
        if (type === '') {
            setError('Vui lòng chọn quy cách');
        }
        else if (quantity <= 0) {
            setError('Số lượng phải lớn hơn 0');
        }
        else {
            setType('');
            setQuantity(1);
            setError('');
            addProductToOrder();
            setIsOpen(false);
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={() => {
            setIsOpen(!isOpen)
            setWarehouseQuantity(0)
            setQuantity(1)
        }}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className='w-80'>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Quy cách</h4>
                        <p className="text-sm text-muted-foreground">
                            Vui lòng chọn quy cách cho sản phẩm
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="type">Quy cách đóng goi</Label>
                            <Select onValueChange={(value) => {
                                const weightPerUnit: UnitWeightPairsList = JSON.parse(value)
                                setType(weightPerUnit.weightPerUnit.toString())
                                setProductUnit(weightPerUnit.productUnit)
                                setWarehouseQuantity(weightPerUnit.quantity)
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
                        {warehouseQuantity > 0 && (
                            <div className='grid grid-cols-3 items-center gap-4'>
                                <Label>Số lượng còn trong kho</Label>
                                <span>{`${warehouseQuantity} Bao`}</span>
                            </div>
                        )}
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
