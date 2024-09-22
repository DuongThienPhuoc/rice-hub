'use client';
import Image from 'next/image';
import searchIcon from '@/components/icon/search.svg';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const query = (form.elements.namedItem('search') as HTMLInputElement).value;
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <form className='bg-[#FFFFFF] flex rounded-lg' onSubmit={handleSearch}>
            <button type="submit">
                <Image className='ml-2' src={searchIcon} alt='search icon' width={30} height={30} />
            </button>
            <input
                name="search"
                className='px-2 py-2 outline-none rounded-lg text-[17px]'
                type='text'
                placeholder='Tìm kiếm'
            />
        </form>
    );
};

export default SearchBar;
