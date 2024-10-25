import { create } from 'zustand';

export interface OrderProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    type: number[];
}

type State = {
    product: OrderProduct;
};
type Actions = {
    updateProducts: (products: OrderProduct) => void;
};

export const orderStore = create<State & Actions>((set) => ({
    product: { id: '', name: '', price: 0, category: '', type: [] },
    updateProducts: (product) => set(() => ({ product: product })),
}));
