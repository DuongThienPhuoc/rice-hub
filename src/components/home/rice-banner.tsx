import {CardCarousel} from "@/components/home/card";

export default function RiceBanner() {
    return (
            <div className='container mx-auto my-5'>
                <div>
                    <div className='text-left border-[#8BC34A] pb-4 border-b-[1px] w-full max-w-full mb-5'>
                        <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl font-arsenal'>Sản phẩm<br/>gạo mới nhất
                        </h1>
                    </div>
                    <div>
                        <CardCarousel/>
                    </div>
                </div>
            </div>
    )
}