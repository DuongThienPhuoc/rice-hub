import {create} from 'zustand'

interface Product {
    id: number;
    name: string;
    type: string;
    quantity: number;
    price: number;
}

type State = {
    selected: Product[]
    total: number
}

type Actions = {
    handleSelected: (product: Product) => void
    handleSelectedAll: (products: Product[]) => void
}

function totalMoney(products: Product[]): number {
    return products.reduce((acc, product) => acc + product.price, 0)
}

export const useProductSelectedStore = create<State & Actions>((set) => ({
    selected: [],
    total: 0,
    handleSelected: (product) => set((state) => {
        let newSelectedProduct: Product[];
        if (state.selected.find((selectedProduct) => selectedProduct.id === product.id)) {
            newSelectedProduct = state.selected.filter((selectedProduct) => selectedProduct.id !== product.id)
        } else {
            newSelectedProduct = [...state.selected, product]
        }
        return {
            selected: newSelectedProduct,
            total: totalMoney(newSelectedProduct)
        }
    }),
    handleSelectedAll: products => set((state) => {
        let newSelectedProduct: Product[];
        if (state.selected.length === products.length) {
            newSelectedProduct = []
        } else {
            newSelectedProduct = products
        }
        return {
            selected: newSelectedProduct,
            total: totalMoney(newSelectedProduct)
        }
    }),
}))