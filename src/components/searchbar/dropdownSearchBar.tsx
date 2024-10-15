'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import ChevronDownIcon from '@/components/icon/downArrowWhite.svg';
import ChevronUpIcon from '@/components/icon/upArrowWhite.svg';

interface Option {
    value: string;
    label: string;
}

interface DropdownSearchBarProps {
    onChange: (value: string) => void;
    selectOptions: Option[];
}

const DropdownSearchBar: React.FC<DropdownSearchBarProps> = ({ onChange, selectOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = selectOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (option: Option) => {
        setSelectedOption(option.label);
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative ml-2 mt-5 lg:mt-0">
            <Button
                className="px-3 py-2 text-white bg-[#1d1d1f] hover:bg-[#1d1d1fcd] outline-none rounded-l-lg text-[14px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption || 'Bảng giá chung'}
                <Image className='ml-2' src={isOpen ? ChevronDownIcon : ChevronUpIcon} alt='toggle arrow' width={8} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-auto bg-white shadow-lg z-10">
                    <input
                        type="text"
                        className="w-auto px-4 py-2 border-b border-gray-200 focus:outline-none"
                        placeholder="Tìm bảng giá..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">Không tìm thấy bảng giá</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownSearchBar;
