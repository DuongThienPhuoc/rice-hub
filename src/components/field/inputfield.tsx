'use client';
import { TextField, Autocomplete } from '@mui/material';
import React from 'react';

interface InputFieldProps {
    titles: { name: string, displayName: string, type: string }[];
    data?: any;
    onFieldChange: (field: string, value: string | number | boolean) => void;
}

const InputField: React.FC<InputFieldProps> = ({ titles, data, onFieldChange }) => {
    const displayData = data || {};

    const handleChange = (name: string, value: string | number | boolean) => {
        onFieldChange(name, value);
    };

    const formatDate = (isoDate: any) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className='w-full'>
            {titles.map(({ name, displayName, type }, index) => (
                <div className='w-full flex flex-col sm:flex-row py-2' key={index}>
                    {type !== 'hidden' && (
                        <div className='flex-[2] mr-3 font-bold pt-4'> {displayName}:</div>
                    )}
                    {type !== 'hidden' ? (
                        type !== 'readOnly' ? (
                            <div className='flex-[4] text-center mb-2'>
                                {type === 'checkbox' ? (
                                    <input
                                        type='checkbox'
                                        className='py-1 border border-gray-400'
                                        checked={!!displayData[name]}
                                        onChange={(e) => handleChange(name, e.target.checked)}
                                    />
                                ) : type !== 'textArea' ? (
                                    name === 'type' ? (
                                        <Autocomplete
                                            disablePortal
                                            className='w-full'
                                            value={displayData[name] || ''}
                                            options={['Thanh toán lương nhân viên', 'Thanh toán tiền nhập hàng', 'Các khoản chi khác']}
                                            onChange={(event, newValue) => handleChange(name, newValue)}
                                            renderInput={(params) => <TextField {...params} variant='standard' label="Loại chi" />}
                                        />
                                    ) : (
                                        <TextField
                                            type={type}
                                            onChange={(e) => handleChange(name, e.target.value)}
                                            className='w-full'
                                            value={typeof displayData[name] === 'string' || typeof displayData[name] === 'number' ? displayData[name] : ''}
                                            label={displayName}
                                            variant="standard"
                                        />
                                    )
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
                            <div className='flex-[4] text-center mb-2'>
                                <TextField
                                    type='text'
                                    disabled
                                    className='w-full'
                                    value={name.toLocaleLowerCase().includes('date') ? formatDate(displayData[name]) : displayData[name]}
                                    label={displayName}
                                    variant="standard"
                                />
                            </div>
                        )
                    ) : (
                        <input type='hidden' value={typeof displayData[name] === 'string' || typeof displayData[name] === 'number' ? displayData[name] : ''} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default InputField;
