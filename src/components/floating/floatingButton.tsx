import { useState } from 'react';
import Image from "next/image";
import xMarkIcon from '@/components/icon/xmarkWhite.svg';
import SupportIcon from '@/components/icon/online_support.svg';

const FloatingButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleInfo = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed flex flex-col items-end bottom-4 right-4 z-50">
            <button
                onClick={toggleInfo}
                className="bg-blue-500 text-[14px] text-white rounded-full px-4 py-2 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                {!isOpen ? (
                    <div className='flex justify-center items-center'>
                        <Image
                            src={SupportIcon}
                            alt={'support icon'}
                            width={15}
                            height={15}
                        />
                        <span className='ml-1'>Liên hệ hỗ trợ</span>
                    </div>
                ) : (
                    <Image
                        src={xMarkIcon}
                        alt={'close icon'}
                        width={15}
                        height={15}
                    />
                )}
            </button>
            {isOpen && (
                <div className="mt-2 p-4 bg-white border rounded-lg shadow-md">
                    <h3 className="font-bold">Thông tin liên lạc</h3>
                    <p>Email: TuanNAHE170268@fpt.edu.com</p>
                    <p>Hotline: 0982730924</p>
                </div>
            )}
        </div>
    );
};

export default FloatingButton;
