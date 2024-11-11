export default function Footer() {
    return (
        <footer className='w-full bg-[#ffffff]'>
            <div className='container mx-auto flex flex-col items-center gap-y-5  lg:grid lg:grid-cols-4 lg:gap-x-5 py-20'>
                <section>
                    <h1 className='font-extrabold text-[32px]'>Ricehub</h1>
                </section>
                <section className='text-center'>
                    <p className='text-[14px]'>Trụ sở chính</p>
                    <h1 className='text-[22px] font-bold'>Công ty TNHH Thanh Quang</h1>
                    <p>Khu 1, Xã Bản Nguyên, Huyện Lâm Thao, Phú Thọ</p>
                    <p>Điện Thoại: 0969 494 834</p>
                </section>
                <section className='text-center'>
                    <p className='text-[14px]'>Đại lý</p>
                    <h1 className='text-[22px] font-bold'>Đại lý phân phối Chử Thị Thanh</h1>
                    <p>Xã Bản Nguyên, Huyện Lâm Thao, Phú Thọ</p>
                    <p>Điện Thoại: 0984 423 469</p>
                </section>
                <section className='text-center'>
                    <p className='text-[20px]'>Liên hệ</p>
                    <p className='text-[18px] font-bold'>Hotline: 0984 423 469</p>
                    <p className='text-[18px] font-bold'>abc@gmail.com</p>
                </section>
            </div>
        </footer>
    )
}