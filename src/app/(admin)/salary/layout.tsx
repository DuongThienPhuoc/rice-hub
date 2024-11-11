import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chấm công',
    description: 'Chấm công',
}

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
