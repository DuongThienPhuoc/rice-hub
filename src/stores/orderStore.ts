import { create } from 'zustand';
import { ProductDtoList } from '@/data/customer-product';

type State = {
    product: ProductDtoList;
};
type Actions = {
    updateProducts: (products: ProductDtoList) => void;
};

export const orderStore = create<State & Actions>((set) => ({
    product: {
        id: 0,
        productCode: '',
        name: '',
        categoryName: '',
        description: '',
        customerPrice: 0,
        image: '',
        categoryId: '',
        supplierId: 0,
        unitOfMeasureId: 0,
        unitWeightPairsList: [],
        warehouseId: null,
    },
    updateProducts: (product) => set(() => ({ product: product })),
}));
