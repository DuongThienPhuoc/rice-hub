'use client';
import Image from 'next/image';
import ReactSlider from 'react-slider';
import ChevronDownIcon from '@/components/icon/downArrow.svg';
import ChevronUpIcon from '@/components/icon/upArrow.svg';
import { useState } from 'react';

interface RangeFilterProps {
    title: string;
    min: number;
    max: number;
    step: number;
    onChange: (minValue: number, maxValue: number) => void;
}

const RangeFilter: React.FC<RangeFilterProps> = ({ title, min, max, step, onChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);
    const [rangeValue, setRangeValue] = useState<[number, number]>([min, max]);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleSliderChange = (values: [number, number]) => {
        setRangeValue(values);
        onChange(values[0], values[1]);
    };

    return (
        <div className="bg-white rounded-md mt-5 px-2 py-2" style={{ boxShadow: '5px 5px 5px lightgray' }}>
            <button onClick={toggleDropdown} className="flex justify-between w-full px-2 items-center">
                <span className="font-bold">{title}</span>
                <Image src={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon} alt="toggle arrow" width={10} height={10} />
            </button>

            {isDropdownOpen && (
                <div className="my-4 mx-2">
                    <span className='text-red-500'>
                        {rangeValue[0].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        <span> - </span>
                        {rangeValue[1].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <br />
                    <small>Phạm vi hiện tại: {(rangeValue[1] - rangeValue[0]).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</small>
                    <ReactSlider
                        className='w-full h-[2px] bg-gray-300 mt-[20px]'
                        value={rangeValue}
                        min={min}
                        max={max}
                        step={step}
                        thumbClassName='w-[23px] h-[23px] top-[-11px] cursor-pointer bg-white rounded-full border-[2px] border-black focus-visible:outline-red-500'
                        onChange={handleSliderChange}
                    />
                </div>
            )}
        </div>
    );
};

export default RangeFilter;
