import Image from "next/image";
import bannerImg from '@/components/assets/img/dong-lua.jpg'

export default function Banner() {
    return (
        <div className='relative z-0'>
            <Image src={bannerImg} alt='banner' className='h-96 lg:h-[700px] w-full object-cover object-bottom '/>
            <div
                className='absolute flex flex-col top-8 gap-y-3 w-full bg-opacity-80 py-6 px-10 text-white lg:top-[190px] lg:left-28 lg:w-[700px] bg-[#3e886d]'>
                <h1 className='font-extrabold text-3xl sm:text-6xl'>Gạo ngon chất<br/>lượng</h1>
                <p className='text-12px sm:text-[18px]'>Chúng tôi cung cấp gạo đặc sản được thu mua từ các vùng chuyên canh, sản
                    xuất lúa gạo lớn trên cả
                    nước , đảm bảo: gạo không đấu trộn, không chất bảo quản, không hoá chất tẩy trắng, tạo mùi</p>
                <div className='text-center bg-[#005c44] w-1/5 py-3 cursor-pointer'>
                    <p className='font-bold'>Liên hệ</p>
                </div>
            </div>
        </div>
    )
}