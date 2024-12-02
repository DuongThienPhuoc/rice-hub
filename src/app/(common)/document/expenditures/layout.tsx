import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Hoá đơn",
};

export default function DocumentLayout({ children }: { children: ReactNode }) {
    return (
        <section>
            {children}
        </section>
    );
}
