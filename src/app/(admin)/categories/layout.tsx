import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Danh mục',
    description: 'Danh mục',
};

export default function CategoryLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
