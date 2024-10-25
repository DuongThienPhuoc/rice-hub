import Image from "next/image";
import ConcoLogo from '@/components/assets/img/con-co.png'
import ArrowRight from '@/components/assets/img/Arrow right.svg'
import ConCoBgWhite from '@/components/assets/img/con-co-c200-bg-white.png'

export default function BranBanner() {
    return (
        <div className='bg-[#455D3C] py-20'>
            <section className='container h-full mx-auto flex-col flex gap-y-7 p-3 lg:grid lg:grid-cols-3 lg:p-0 items-center'>
                <section className='flex flex-col items-center gap-y-7'>
                    <div className='w-20 md:w-[124px] md:h-auto'>
                        <Image src={ConcoLogo} alt='concologo' className='object-cover object-center' />
                    </div>
                    <article>
                        <h1 className='font-arsenal text-4xl font-bold text-white'>Thức ăn gia súc</h1>
                    </article>
                    <article className='flex'>
                        <p className='text-white'>Liên hệ với chúng tôi</p>
                        <Image src={ArrowRight} alt='arrowlogo' />
                    </article>
                </section>
                <section className='lg:col-span-2 gap-x-7 flex ms-auto'>
                    <BrandCard />
                    <BrandCard />
                </section>
            </section>
        </div>
    )
}

function BrandCard() {
    return (
        <section className='flex flex-col gap-y-5'>
            <div className='w-auto h-auto'>
                <Image src={ConCoBgWhite} alt='concobgwhite' className='w-full h-full object-fill object-center' />
            </div>
            <article>
                <p className='font-bold text-[20px] font-arsenal text-white'>Cám con cò-C200</p>
            </article>
        </section>
    )
}