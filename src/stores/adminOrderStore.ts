import { create } from 'zustand';
import { Order } from '@/type/order';

type State = {
    order: Order | object;
};
type Actions = {
    updateOrder: (order: Order) => void;
};

export const adminOrdersStore = create<State & Actions>((set) => ({
    order: {},
    updateOrder: (order) => set(() => ({ order: order })),
}));
