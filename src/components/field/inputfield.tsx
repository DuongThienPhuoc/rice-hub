'use client';
import { TextField } from '@mui/material';
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
                <div className='w-full flex flex-col sm:flex-row py-2' key={index}>
                    {type !== 'hidden' && (
                        <div className='flex-[2] mr-3 font-bold pt-4'> {displayName}:</div>
                    )}
                    {type !== 'hidden' ? (
                        <div className='flex-[4] text-center mb-2'>
                            {type === 'checkbox' ? (
                                <input
                                    type='checkbox'
                                    className='py-1 border border-gray-400'
                                    checked={!!displayData[name]}
                                    onChange={(e) => handleChange(name, e.target.checked)}
                                />
                            ) : type !== 'textArea' ? (
                                <TextField
                                    type={type}
                                    onChange={(e) => handleChange(name, e.target.value)}
                                    className='w-full'
                                    value={typeof displayData[name] === 'string' || typeof displayData[name] === 'number' ? displayData[name] : ''}
                                    label={displayName}
                                    variant="standard"
                                />
                            ) : (
                                <TextField
                                    type={type}
                                    onChange={(e) => handleChange(name, e.target.value)}
                                    className='w-full'
                                    value={typeof displayData[name] === 'string' ? displayData[name] : ''}
                                    label={displayName}
                                    rows={4}
                                    multiline
                                />
                            )}
                        </div>
                    ) : (
                        <input type='hidden' value={typeof displayData[name] === 'string' || typeof displayData[name] === 'number' ? displayData[name] : ''} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default InputField;
