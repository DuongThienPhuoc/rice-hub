import { ReactNode } from 'react';
import { Metadata } from 'next';

interface InvoiceLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Hoá đơn",
    description: "Trang hoá đơn",
}

export default function InvoiceLayout({ children }: InvoiceLayoutProps) {
    return (
        <section>
            {children}
        </section>
    );
}
