import RiceImg
    from '@/components/assets/img/Remove background project/Remove background project/Remove background project-1.png'
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

export function CardCarousel() {
    return (
        <Carousel>
            <CarouselContent>
                <CarouselItem className='md:basis-1/3'><Card /></CarouselItem>
                <CarouselItem className='md:basis-1/3'><Card /></CarouselItem>
                <CarouselItem className='md:basis-1/3'><Card /></CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}

export function Card() {
    return (
        <div className='flex flex-col gap-[35px]'>
            <div className='w-full h-[583px] md:h-[350px] lg:h-[583px]'>
                <Image src={RiceImg} alt='Rice' className='h-full w-full object-cover object-center' />
            </div>
            <div>
                <p className='font-bold text-[20px]'>Gạo thơm Neptune</p>
            </div>
        </div>
    )
}