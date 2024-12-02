import { create } from 'zustand';
import React from 'react';

interface BreadcrumbStore {
    breadcrumb: React.ReactNode;
    setBreadcrumb: (breadcrumb: React.ReactNode) => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
    breadcrumb: null,
    setBreadcrumb: (breadcrumb) => set({ breadcrumb }),
}));