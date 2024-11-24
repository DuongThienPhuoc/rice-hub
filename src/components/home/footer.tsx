import { ChevronRight, Mail, MapPin, Phone, Link } from 'lucide-react';

export default function Footer() {
    return (
        <footer className='w-full py-[100px] bg-[url("/images/banner.jpg")] bg-cover bg-no-repeat bg-top mt-20'>
            <div className="w-[90vw] gap-10 md:w-[60vw] mx-auto grid grid-cols-1 md:grid-cols-3 md:gap-10">
                <div>
                    <div className="space-y-4">
                        <h1 className="font-philosopher text-[20px] font-bold">
                            Về gạo Thanh Quang
                        </h1>
                        <p className="text-[16px] text-justify font-philosopher">
                            Công ty Thanh Quang tự hào là đơn vị uy tín trong
                            lĩnh vực cung cấp cám và gạo chất lượng cao. Với cam
                            kết đặt chất lượng và giá trị tự nhiên lên hàng đầu,
                            chúng tôi mang đến những sản phẩm được sản xuất từ
                            nguồn nguyên liệu sạch, đảm bảo an toàn và dinh
                            dưỡng. Chúng tôi luôn nỗ lực từng ngày để đem lại sự
                            hài lòng tối đa cho khách hàng, góp phần nâng cao
                            giá trị cuộc sống và phát triển bền vững.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="space-y-4">
                        <p className="font-philosopher text-[20px] font-bold">
                            Hỗ trợ khách hàng
                        </p>
                        <div>
                            <ul className="font-philosopher space-y-4">
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Chính sách khách hàng thân thiết
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Hướng dẫn đặt hàng
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Bảo hành đổi trả
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Quy định giao hàng
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Hướng dẫn thanh toán
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className="bg-[#a5b29b] md:w-fit p-3">
                        <div className='bg-[#8f9f82] p-3 space-y-2 font-philosopher'>
                            <p className="font-philosopher text-[30px] font-bold">
                                Liên hệ
                            </p>
                            <div className="flex items-center gap-2 font-semibold">
                                <MapPin className="w-5 h-5" />
                                <p>
                                    Khu 1, Xã Bản Nguyên, Huyện Lâm Thao, Phú
                                    Thọ
                                </p>
                            </div>
                            <div className="flex items-center gap-2 font-semibold">
                                <Phone className="w-5 h-5" />
                                <p>+84 987 654 321</p>
                            </div>
                            <div className="flex items-center gap-2 font-semibold">
                                <Mail className="w-5 h-5" />
                                <p>abc@gmail.com</p>
                            </div>
                            <div className="flex items-center gap-2 font-semibold">
                                <Link className="w-5 h-5" />
                                <p>https://gaothanhquang.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
