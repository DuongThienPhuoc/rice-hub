/* eslint-disable @next/next/no-img-element */
'use client';
import TextField from '@/components/field/textfield';
import React from 'react';

interface PopupDetailProps {
    tableName: string;
    data: Record<string, string | number | boolean>;
    titles: {
        name: string;
        displayName: string;
        type: string;
    }[];
    handleClose: () => void;
}

const PopupDetail: React.FC<PopupDetailProps> = ({ tableName, data, titles, handleClose }) => {

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className='w-fit p-5 flex bg-white rounded-lg flex-col lg:flex-row'>
                <div className='w-full py-3 h-full flex flex-col justify-between items-center lg:items-start'>
                    <div className='w-full flex justify-between items-center pb-5 px-5'>
                        <h1 className='font-bold'>Chi tiết {tableName.toLocaleLowerCase()}</h1>
                        <button onClick={handleClose}>
                            <span className="text-black text-xl hover:text-gray-500">✖</span>
                        </button>
                    </div>
                    <div className='px-6'>
                        <TextField titles={titles} data={data}></TextField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupDetail;
