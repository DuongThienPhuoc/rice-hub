import Image from 'next/image';

export default function ContactBanner() {
    const riceBanner = [
        {
            title: 'Sản phẩm',
            img: '/images/placeholder_1.jpg',
        },
        {
            title: 'Địa chỉ',
            img: '/images/placeholder_2.jpg',
        },
        {
            title: 'Liên hệ',
            img: '/images/placeholder_3.jpg',
        }
    ]
    return (
        <section className="container mx-auto sm:h-[70vh] flex items-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 w-[80%] mx-auto">
                    {riceBanner.map((item, index) => (
                        <div
                            key={index}
                            className="text-center hover:cursor-pointer"
                        >
                            <p className="text-[29px] my-5 font-bold font-amatic">
                                {item.title}
                            </p>
                            <div className="relative h-[450px] hover:scale-105 transition duration-300">
                                <Image
                                    src={item.img}
                                    alt="placeholder_1"
                                    fill
                                    style={{objectFit:'cover'}}
                                    sizes={'100%'}
                                />
                            </div>
                        </div>
                    ))}
                </div>
        </section>
    );
}