import { create } from 'zustand';

type NotificationStore = {
    hasNewNotification: boolean;
    setHasNewNotification: (state: boolean) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
    hasNewNotification: false,
    setHasNewNotification: (state) => set({ hasNewNotification: state }),
}));
