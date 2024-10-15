import type { Metadata } from "next";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";

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
        <body>
        {children}
        <Toaster/>
        </body>
        </html>
    );
}
