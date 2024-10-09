import {create} from 'zustand'

type State = {
    price: number
}

type Actions = {
    setPrice: (price: State['price']) => void
}

export const productPriceStore = create<State & Actions>((set) => ({
    price: 0,
    setPrice: (price) => set(() => ({price: price}))
}))