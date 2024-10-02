'use client';
import Image from 'next/image';
import ChevronDownIcon from '@/components/icon/downArrow.svg';
import ChevronUpIcon from '@/components/icon/upArrow.svg';
import { useState } from 'react';

interface CheckBoxFilterProps {
    title: string;
    options: { label: string, value: number | string }[];
    onChange: (selectedValues: (number | string)[]) => void;
}

const CheckBoxFilter: React.FC<CheckBoxFilterProps> = ({ title, options, onChange }) => {
    const [filterDropdown, setFilterDropdown] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<(number | string)[]>([]);

    const handleFilterDropdown = () => {
        setFilterDropdown(!filterDropdown);
    };

    const handleOptionChange = (value: number | string) => {
        const updatedSelectedOptions = selectedOptions.includes(value)
            ? selectedOptions.filter((option) => option !== value)
            : [...selectedOptions, value];

        setSelectedOptions(updatedSelectedOptions);
        onChange(updatedSelectedOptions);
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
                                type="checkbox"
                                name="type"
                                value={option.value}
                                checked={selectedOptions.includes(option.value)}
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

export default CheckBoxFilter;
