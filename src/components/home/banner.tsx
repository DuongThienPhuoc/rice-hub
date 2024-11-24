'use client';

import { Arimo } from 'next/font/google';
import { cn } from '@/lib/utils';
import style from '@/style/Landing-page.module.css';
import { useRouter } from 'next/navigation';

const arimo = Arimo({
    subsets: ['latin'],
    display: 'swap',
});
export default function Banner() {
    const router = useRouter();
    return (
        <section className="w-full h-[100vh] bg-[url('/images/banner_img.jpg')] bg-cover bg-center">
            <div className="w-full bg-black/50 h-full flex flex-col justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-white font-amatic font-semibold text-[106px]">
                        Cám gạo Thanh Quang
                    </h1>
                    <h2
                        className={cn(
                            'text-white text-[15px]',
                            arimo.className,
                        )}
                    >
                        CÁM GẠO CHẤT LƯỢNG - GIÁ TRỊ TỰ NHIÊN.
                    </h2>
                    <h3
                        className={cn(
                            'text-white text-[15px]',
                            arimo.className,
                        )}
                    >
                        LÀ ĐƠN VỊ SẢN XUẤT & CUNG CẤP CÁM GẠO UY TÍN, ĐẢM BẢO
                        NGUỒN NGUYÊN LIỆU TỰ NHIÊN, AN TOÀN VÀ BỀN VỮNG
                    </h3>
                </div>
                <div className="text-center mt-20 z-10">
                    <button
                        className={cn(arimo.className, style.order_button)}
                        onClick={() => router.push('/order')}
                    >
                        Đặt hàng ngay
                    </button>
                </div>
            </div>
            <div className="absolute bg-[url('/images/brush_overlay.png')] bg-no-repeat bg-bottom bottom-0 w-full h-full z-0"></div>
        </section>
    );
}
