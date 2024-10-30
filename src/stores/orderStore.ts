import { create } from 'zustand';
import {ProductDtoList} from '@/data/customer-product';

export interface OrderProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    type: number[];
}

type State = {
    product: ProductDtoList;
};
type Actions = {
    updateProducts: (products: ProductDtoList) => void;
};

export const orderStore = create<State & Actions>((set) => ({
    product: {productCode: '', name: '', description: '', price: 0, image: '', categoryId: '', supplierId: 0, unitOfMeasureId: 0, unitWeightPairsList: [], warehouseId: null},
    updateProducts: (product) => set(() => ({ product: product })),
}));
