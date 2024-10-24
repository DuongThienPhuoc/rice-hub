import { create } from 'zustand';
import { ProductDtoList } from '@/data/customer-product';

type State = {
    products: ProductDtoList[];
};

type Actions = {
    setProducts: (products: ProductDtoList[]) => void;
};

export const useProductStore = create<State & Actions>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
}));
