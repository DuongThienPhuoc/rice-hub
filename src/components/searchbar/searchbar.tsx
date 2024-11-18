'use client';
import { Skeleton } from '@mui/material';
import { ChevronDown, ChevronUp, SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SearchBarProps {
    onSearch: (query: string, field: string) => void;
    selectOptions: Option[];
    loadingData: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, selectOptions, loadingData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(selectOptions[0]);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const query = (form.elements.namedItem('search') as HTMLInputElement).value;
        const field = selected.value;
        if (onSearch) {
            onSearch(field, query);
        }
    };

    return (
        <form className={`bg-[#FFFFFF] flex rounded-lg border ${!loadingData && 'border-[#4ba94d]'} `} onSubmit={handleSearch}>
            {loadingData ? (
                <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
            ) : (
                <>
                    <div className="relative text-[14px]">
                        <div
                            className="p-2 bg-[#4ba94d] hover:bg-green-500 flex items-center text-white font-semibold rounded-l-lg cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {selected.label} {isOpen ? (<ChevronUp size={20} className='ml-1' />) : (<ChevronDown size={20} className='ml-1' />)}
                        </div>
                        {isOpen && (
                            <div className="absolute bg-white border border-gray-300 mt-1 rounded-lg shadow-lg">
                                {selectOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className="p-2 rounded-lg hover:bg-green-500 hover:text-white cursor-pointer"
                                        onClick={() => {
                                            setSelected(option);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        name="search"
                        className='p-2 outline-none text-[14px]'
                        type='text'
                        placeholder='Tìm kiếm'
                    />
                    <button type="submit" className='hover:bg-gray-200 hover:rounded-r-lg'>
                        <SearchIcon size={20} className='mx-2' color='#4ba94d' />
                    </button>
                </>
            )}
        </form >
    );
};

export default SearchBar;
