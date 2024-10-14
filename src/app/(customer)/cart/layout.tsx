import {ReactNode} from "react";
import Navbar from "@/components/navbar/navbar";

export default function CartLayout({children}: { children: ReactNode }) {
    return (
        <main>
            <Navbar/>
            <section className='container mx-auto'>
                {children}
            </section>
        </main>
    )
}