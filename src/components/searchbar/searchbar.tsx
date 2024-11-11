'use client';
import Image from 'next/image';
import searchIcon from '@/components/icon/search.svg';
import { Skeleton } from '@mui/material';

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
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const query = (form.elements.namedItem('search') as HTMLInputElement).value;
        const field = (form.elements.namedItem('searchField') as HTMLSelectElement).value;
        if (onSearch) {
            onSearch(field, query);
        }
    };

    return (
        <form className='bg-[#FFFFFF] flex rounded-lg' onSubmit={handleSearch}>
            {loadingData ? (
                <Skeleton animation="wave" variant="rectangular" height={40} width={300} className='rounded-lg' />
            ) : (
                <>
                    <select className='p-2 text-white bg-[#1d1d1f] hover:bg-[#1d1d1fcd] outline-none rounded-l-lg text-[14px]' name="searchField">
                        {selectOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        name="search"
                        className='p-2 outline-none text-[14px]'
                        type='text'
                        placeholder='Tìm kiếm'
                    />
                    <button type="submit" className='hover:bg-gray-200 hover:rounded-r-lg'>
                        <Image className='mx-2 min-w-[14px] min-h-[14px]' src={searchIcon} alt='search icon' width={20} height={20} />
                    </button>
                </>
            )}
        </form >
    );
};

export default SearchBar;
