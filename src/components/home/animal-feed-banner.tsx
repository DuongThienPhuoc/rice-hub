import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const AnimalFeedBanner: React.FC = () => {
    const animalFeedBanner = [
        {
            title: 'DELICE A - THỨC ĂN TẬP ĂN CHO HEO CON TỪ 7 NGÀY TUỔI ĐẾN 9KG',
            img: '/images/con_co_delice_a.webp',
        },
        {
            title: 'DELICE B - THỨC ĂN TẬP ĂN CHO HEO CON TỪ 7 NGÀY TUỔI ĐẾN 20KG',
            img: '/images/con_co_delice_b.webp',
        },
        {
            title: 'CON CÒ C14 - THỨC ĂN TẬP ĂN CHO HEO CON TỪ 7 NGÀY TUỔI ĐẾN 20KG',
            img: '/images/con_co_c14.webp',
        },
        {
            title: 'CON CÒ 16L - THỨC ĂN HỖN HỢP CHO GÀ THỊT TỪ 01 NGÀY TUỔI - XUẤT CHUỒNG',
            img: '/images/con_co_16l.webp',
        },
    ];
    return (
        <section className="container mx-auto mt-10">
            <div className="w-full">
                <div className="text-center">
                    <p className="text-[50px] font-amatic font-bold">
                        Thức ăn <span className="text-[#3e603b]">gia súc</span>
                    </p>
                </div>
            </div>
            <div className="w-[80%] grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-10 mx-auto mt-10">
                {animalFeedBanner.map((item, index) => (
                    <Card title={item.title} img={item.img} key={index} />
                ))}
            </div>
        </section>
    );
};

function Card({ img, title }: { img: string; title: string }) {
    return (
        <div className="shadow rounded">
            <div className="relative h-[300px] hover:scale-110 transition duration-300">
                <Image
                    src={img}
                    alt="conco"
                    fill
                    sizes={'100%'}
                    style={{
                        objectFit: 'contain',
                        borderRadius: '4px 4px 0 0',
                    }}
                />
            </div>
            <div className="space-y-4 p-3">
                <div className="text-center">
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">
                        {title}
                    </p>
                </div>
                <div className="flex items-center gap-2 w-fit bg-[#8f9f82] mx-auto px-4 py-2.5 rounded-[10px] text-white font-bold hover:cursor-pointer hover:scale-105 transition duration-300">
                    <p>Xem thêm</p>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}

export default AnimalFeedBanner;
