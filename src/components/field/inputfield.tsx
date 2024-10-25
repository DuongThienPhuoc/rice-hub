'use client';
import React from 'react';

interface InputFieldProps {
    titles: { name: string, displayName: string, type: string }[];
    data?: Record<string, string | number | boolean>;
    onFieldChange: (field: string, value: string | number | boolean) => void;
}

const InputField: React.FC<InputFieldProps> = ({ titles, data, onFieldChange }) => {
    const displayData = data || {};

    const handleChange = (name: string, value: string | number | boolean) => {
        onFieldChange(name, value);
    };

    return (
        <div className='w-full'>
            {titles.map(({ name, displayName, type }, index) => (
                <div className='w-full flex flex-col sm:flex-row  py-2' key={index}>
                    {type !== 'hidden' && (
                        <div className='flex-[3] mr-3 font-bold pt-1'> {displayName}:</div>
                    )}
                    <div className='flex-[4] text-center'>
                        {type === 'checkbox' ? (
                            <input
                                type='checkbox'
                                className='py-1 border border-gray-400'
                                checked={!!displayData[name]}
                                onChange={(e) => handleChange(name, e.target.checked)}
                            />
                        ) : type !== 'textArea' ? (
                            <input
                                type={type}
                                className='px-3 py-1 border w-full border-gray-400'
                                value={typeof displayData[name] === 'string' || typeof displayData[name] === 'number' ? displayData[name] : ''}
                                onChange={(e) => handleChange(name, e.target.value)}
                            />
                        ) : (
                            <textarea
                                className='px-3 py-1 border w-full min-h-[100px] border-gray-400'
                                value={typeof displayData[name] === 'string' ? displayData[name] : ''}
                                onChange={(e) => handleChange(name, e.target.value)}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InputField;
