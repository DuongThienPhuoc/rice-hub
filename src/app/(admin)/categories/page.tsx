'use client';
import Navbar from "@/components/navbar/navbar";
import ResponsiveNavbar from "@/components/navbar/responsiveNavbar";
import { Button } from '@/components/ui/button';
import CategoryList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import { useRouter } from 'next/navigation';
import api from "../../../api/axiosConfig";

const Page = () => {
    const router = useRouter();
    const columns = ['Mã danh mục', 'Tên danh mục', 'Mô tả chi tiết', ''];
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const response = await api.get("/categories/all");
            const data = response.data;
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    useEffect(() => {
        getCategories();
    }, []);

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const navigateToCreate = () => {
        router.push('/categories/create');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const [navbarVisible, setNavbarVisible] = useState(false);

    useEffect(() => {
        const updateNavbarVisibility = () => {
            const shouldShowNavbar = window.innerWidth >= 1100;
            setNavbarVisible(shouldShowNavbar);
        };

        updateNavbarVisibility();

        window.addEventListener('resize', updateNavbarVisibility);

        return () => {
            window.removeEventListener('resize', updateNavbarVisibility);
        };
    }, []);
    return (
        <div>
            {navbarVisible ? (
                <Navbar />
            ) : (
                <ResponsiveNavbar />
            )}
            <div className="flex">
                <div style={{ flex: '1' }}></div>
                <div style={{ flex: '9' }} className='my-16 overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle mb-10'>
                        {navbarVisible && (
                            <h1 className='font-bold text-[20px] pb-5'><strong>Danh sách danh mục</strong></h1>
                        )}
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {!navbarVisible && (
                                <h1 className='font-bold text-[20px] pb-5 px-5'><strong>Danh sách danh mục</strong></h1>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                selectOptions={[
                                    { value: 'id', label: 'Mã danh mục' },
                                    { value: 'name', label: 'Tên danh mục' }
                                ]}
                            />
                            <Button onClick={navigateToCreate} className='ml-4 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm danh mục
                            </Button>
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <CategoryList columns={columns} data={categories} />
                    </div>
                    <Paging
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
                <div style={{ flex: '1' }}></div>
            </div>
            <FloatingButton />
        </div>
    );
};

export default Page;