'use client';
import { useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

interface SideFilterProps {
    filter: boolean;
    setFilter: (state: boolean) => void;
}

export default function SideFilter({ filter, setFilter }: SideFilterProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setFilter(false);
        }
    };

    useEffect(() => {
        if (filter) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [filter]);

    return (
        <div>
            <div
                ref={sidebarRef}
                className={`fixed top-[75px] left-0 w-[250px] h-full bg-[#1f1f1d] text-white shadow-lg transition-transform duration-300 ease-in-out transform ${filter ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className='flex items-start flex-col'>
                    <button onClick={() => router.push('/')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Các loại gạo khác</button>
                </div>
            </div>
        </div>
    );
}
