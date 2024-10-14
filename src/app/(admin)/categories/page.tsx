'use client';
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/navbar/sidebar";
import { Button } from '@/components/ui/button';
import CategoryList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import PopupCreate from "@/components/popup/popupCreate";

const Page = () => {
    const columns = [
        { name: 'id', displayName: 'Mã danh mục' },
        { name: 'name', displayName: 'Tên danh mục' },
        { name: 'description', displayName: 'Mô tả chi tiết' },
        { name: '', displayName: '' },
    ];
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [navbarVisible, setNavbarVisible] = useState(false);
    const titles = [
        { name: 'id', displayName: 'Mã danh mục', type: 'hidden' },
        { name: 'name', displayName: 'Tên danh mục', type: 'text' },
        { name: 'description', displayName: 'Mô tả chi tiết', type: 'textArea' },
    ];

    const openPopup = () => setPopupVisible(true);
    const closeCreate = (reload?: boolean) => {
        setPopupVisible(false);
        if (reload == true) {
            setCurrentPage(1);
            setCurrentSearch({ field: '', query: '' });
        }
    }

    const closeEdit = (reload?: boolean) => {
        if (reload == true) {
            getCategories(currentPage, currentSearch);
        }
    }

    const getCategories = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const token = localStorage.getItem("token");
            const url = `/categories/?${params.toString()}`;
            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            setCategories(data._embedded.categoryList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error);
        }
    };

    useEffect(() => {
        getCategories(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                <Sidebar />
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
                                    { value: 'name', label: 'Tên danh mục' },
                                ]}
                            />
                            <Button onClick={openPopup} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm danh mục
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <CategoryList name="Danh mục" editUrl="/categories/updateCategory" titles={titles} columns={columns} data={categories} tableName="categories" handleClose={closeEdit} />
                    </div>
                    {totalPages > 1 && (
                        <Paging
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
                <div style={{ flex: '1' }}></div>
            </div>
            {isPopupVisible && <PopupCreate tableName="Danh mục" url="/categories/createCategory" titles={titles} handleClose={closeCreate} />}
            <FloatingButton />
        </div>
    );
};

export default Page;