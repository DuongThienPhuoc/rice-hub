'use client';
import Image from 'next/image';
import ChevronDownIcon from '@/components/icon/downArrow.svg';
import ChevronUpIcon from '@/components/icon/upArrow.svg';
import { useState } from 'react';

interface RadioFilterProps {
    title: string;
    options: { label: string, value: number | string }[];
    onChange: (value: number | string) => void;
}

const RadioFilter: React.FC<RadioFilterProps> = ({ title, options, onChange }) => {
    const [filterDropdown, setFilterDropdown] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | string | null>(null);

    const handleFilterDropdown = () => {
        setFilterDropdown(!filterDropdown);
    };

    const handleOptionChange = (value: number | string) => {
        setSelectedOption(value);
        onChange(value);
    };

    return (
        <div className="bg-white rounded-md mt-5 px-2 py-2" style={{ boxShadow: '5px 5px 5px lightgray' }}>
            <button onClick={handleFilterDropdown} className="flex justify-between w-full px-2 items-center">
                <span className="font-bold">{title}</span>
                <Image src={filterDropdown ? ChevronDownIcon : ChevronUpIcon} alt='toggle arrow' width={10} height={10} />
            </button>

            {filterDropdown && (
                <div className="mt-4">
                    {options.map((option) => (
                        <div key={option.value} className="flex items-center my-3">
                            <input
                                className="mx-2"
                                type="radio"
                                name="type"
                                value={option.value}
                                checked={selectedOption === option.value}
                                onChange={() => handleOptionChange(option.value)}
                            />
                            <span>{option.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RadioFilter;
