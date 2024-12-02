import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bảng Lương',
};

export default function PayrollLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        {children}
    </>;
}
