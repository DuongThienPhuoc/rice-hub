import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import React from 'react';

export const metadata: Metadata = {
    title: "RiceHub",
    description: "Hệ thống quản lý kho gạo",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/png" href="/favicon.ico" />
                <title>Cám Gạo Thanh Quang</title>
            </head>
            <body>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
