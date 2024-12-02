'use client'

import { useBreadcrumbStore } from '@/stores/breadcrumb';

export default function BreadCrumbDisplay() {
    const { breadcrumb } = useBreadcrumbStore();
    return breadcrumb ? <>{breadcrumb}</> : null;
}
