import React from "react";
import Navbar from "@/components/navbar/navbar";

export default function OrderPageLayout({children}: { children: React.ReactNode }) {
    return (
        <main>
            <Navbar/>
            {children}
        </main>
    )
}