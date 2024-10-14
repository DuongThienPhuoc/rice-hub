'use client';
import React from 'react';

interface TextFieldProps {
    titles: { name: string, displayName: string }[];
    data: Record<string, string | number | boolean>;
}

const TextField: React.FC<TextFieldProps> = ({ titles, data }) => {

    return (
        <div className='w-full'>
            {titles.map(({ name, displayName }, index) => (
                <div className='w-full flex flex-col sm:flex-row lg:flex-col xl:flex-row py-2' key={index}>
                    <div className='flex-[3] mr-3 font-bold pt1'>{displayName}:</div>
                    <div className='flex-[4]'>
                        <h1 className='px-3 py-1 w-[260px]'>
                            {typeof data[name] === 'boolean'
                                ? (data[name] ? 'Hoạt động' : 'Không hoạt động')
                                : data[name]}
                        </h1>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TextField