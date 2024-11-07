import { create } from 'zustand';
import { CartProduct } from '@/app/(customer)/cart/table';

type State = {
    selected: CartProduct[];
    total: number;
};

type Actions = {
    handleSelected: (product: CartProduct) => void;
    handleSelectedAll: (products: CartProduct[]) => void;
};

function totalMoney(products: CartProduct[]): number {
    return products.reduce((acc, product) => acc + product.price, 0);
}

export const useProductSelectedStore = create<State & Actions>((set) => ({
    selected: [],
    total: 0,
    handleSelected: (product) =>
        set((state) => {
            let newSelectedProduct: CartProduct[];
            if (
                state.selected.find(
                    (selectedProduct) =>
                        selectedProduct.cartId === product.cartId,
                )
            ) {
                newSelectedProduct = state.selected.filter(
                    (selectedProduct) =>
                        selectedProduct.cartId !== product.cartId,
                );
            } else {
                newSelectedProduct = [...state.selected, product];
            }
            return {
                selected: newSelectedProduct,
                total: totalMoney(newSelectedProduct),
            };
        }),
    handleSelectedAll: (products) =>
        set((state) => {
            let newSelectedProduct: CartProduct[];
            if (state.selected.length === products.length) {
                newSelectedProduct = [];
            } else {
                newSelectedProduct = products;
            }
            return {
                selected: newSelectedProduct,
                total: totalMoney(newSelectedProduct),
            };
        }),
}));
