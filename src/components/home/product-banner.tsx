import Image from 'next/image';
import { Cannabis } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductBanner() {
    const tab = [
        {
            title: 'Gạo',
        },
        {
            title: 'Cám',
        },
        {
            title: 'Gạo lứt',
        },
    ];

    const riceBanner = [
        {
            title: 'Gạo ST25',
            img: '/images/rice_1.jpg',
        },
        {
            title: 'Gạo ST25',
            img: '/images/rice_2.jpg',
        },
        {
            title: 'Gạo ST25',
            img: '/images/rice_3.jpg',
        },
        {
            title: 'Gạo ST25',
            img: '/images/rice_4.jpg',
        },
        {
            title: 'Gạo ST25',
            img: '/images/rice_5.jpg',
        },
        {
            title: 'Gạo ST25',
            img: '/images/rice_6.jpg',
        },
    ];

    return (
        <section className="container mx-auto mt-10 md:mt-0">
            <div className="w-full space-y-4">
                <div className="text-center">
                    <p className="text-[50px] font-amatic font-bold">
                        Các <span className="text-[#3e603b]">sản phẩm</span>
                    </p>
                </div>
                <div className="flex justify-center items-center gap-10">
                    {tab.map((item, index) => (
                        <TabCard title={item.title} key={index} />
                    ))}
                </div>
            </div>
            <div className="w-[80%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-10 mx-auto mt-10">
                {riceBanner.map((item, index) => (
                    <Card title={item.title} img={item.img} key={index} />
                ))}
            </div>
            <div className="w-[80%] mx-auto mt-20">
                <div className="flex gap-2 items-center bg-[#99af80] w-fit mx-auto px-4 py-1 rounded-[10px] text-white tracking-wide shadow-lg hover:cursor-pointer hover:scale-110 transition duration-300">
                    <Cannabis className="h-4 w-4" />
                    <p>Xem toàn bộ sản phẩm</p>
                </div>
            </div>
        </section>
    );
}

function TabCard({ title }: { title: string }) {
    return (
        <div
            className={cn(
                'rounded-full bg-[#eee] px-6 py-2.5 hover:cursor-pointer hover:bg-[#3e603b] hover:text-white transition duration-300',
                title === 'Gạo' && 'bg-[#8f9f82]',
            )}
        >
            <p className="font-bold text-xl font-amatic">{title}</p>
        </div>
    );
}

function Card({ img, title }: { img: string; title: string }) {
    return (
        <div className="shadow rounded hover:scale-105 transition duration-300 hover:cursor-pointer">
            <div className="relative h-[250px]">
                <Image
                    src={img}
                    alt="conco"
                    fill
                    sizes={'100%'}
                    style={{
                        objectFit: 'cover',
                        borderRadius: '4px 4px 0 0',
                    }}
                />
            </div>
            <div className="space-y-4 p-3">
                <div className="text-center">
                    <p className="font-bold font-amatic text-2xl">{title}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded border hover:scale-105 transition duration-300">
                        <p className="text-sm">30KG</p>
                    </div>
                    <div className="px-4 py-2 rounded border hover:scale-105 transition duration-300">
                        <p className="text-sm">50KG</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
