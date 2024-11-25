import Image from 'next/image';
import React from 'react';

export default function SectionInfor() {
    const topics = [
        {
            title: 'Cam Kết Về Chất Lượng',
            content:
                'Mỗi hạt gạo đều trải qua quy trình sản xuất nghiêm ngặt, đảm bảo thơm ngon, sạch và giàu dinh dưỡng. Chúng tôi cam kết mang đến sản phẩm đạt chuẩn chất lượng cao nhất.',
        },
        {
            title: 'Sự Tinh Túy Từ Thiên Nhiên',
            content:
                'Được canh tác trên những cánh đồng màu mỡ, gạo của chúng tôi giữ trọn hương vị tự nhiên, không hóa chất, mang đến sự an toàn và dinh dưỡng tuyệt đối.',
        },
        {
            title: 'Uy Tín Trong Từng Dịch Vụ',
            content:
                'Chúng tôi đặt chữ "Uy tín" lên hàng đầu với dịch vụ nhanh chóng, tận tâm và đảm bảo gạo luôn đến tay bạn trong trạng thái tươi ngon nhất.',
        },
    ];
    return (
        <section className="bg-[url('/images/banner.jpg')] w-full sm:h-[100vh] mt-10 py-10 sm:py-0 bg-cover bg-no-repeat">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 sm:h-full">
                <div className="flex items-center">
                    <div className="h-[500px] sm:h-[80%] w-[75%] mx-auto bg-white p-4 hover:scale-90 transition duration-300">
                        <div className="relative h-full w-full">
                            <Image
                                src="/images/rice_plant.jpg"
                                alt="rice_plant"
                                fill
                                sizes={'100%'}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center px-2 md:px-0 mt-10 sm:mt-0">
                    <div>
                        <h1 className="text-[40px] md:text-[50px] md:text-left font-amatic font-bold text-center">
                            Uy tín – Chất lượng – Giá trị tự nhiên
                        </h1>
                        <p className="mt-6 italic text-center md:text-left">
                            Chúng tôi tin rằng mỗi hạt gạo không chỉ là nguồn
                            dinh dưỡng, mà còn là kết tinh của sự chăm sóc, tận
                            tụy và giá trị từ thiên nhiên. Với phương châm Uy
                            tín – Chất lượng – Giá trị tự nhiên, chúng tôi cam
                            kết mang đến cho khách hàng những sản phẩm gạo sạch,
                            an toàn và thơm ngon nhất. Từ việc lựa chọn giống
                            lúa, canh tác trên những cánh đồng màu mỡ đến quy
                            trình chế biến hiện đại, mọi công đoạn đều được kiểm
                            soát nghiêm ngặt để đảm bảo chất lượng cao nhất.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                            {topics.map((topic, index) => (
                                <div className="space-y-4 text-center md:text-left" key={index}>
                                    <h1 className="text-[24px] font-amatic font-bold">
                                        {topic.title}
                                    </h1>
                                    <p className="text-gray-600 text-[16px] leading-relaxed italic">
                                        {topic.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
