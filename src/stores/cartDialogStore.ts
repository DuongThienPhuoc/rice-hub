import { create } from 'zustand';

type State = {
    type: number;
    quantity: number;
};

type Actions = {
    setType: (type: number) => void;
    setQuantity: (quantity: number) => void;
};

export const useCartDialogStore = create<State & Actions>((set) => ({
    type: 0,
    quantity: 1,
    setType: (type) => set({ type }),
    setQuantity: (quantity) => set({ quantity }),
}));
