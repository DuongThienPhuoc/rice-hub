/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import ProductList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import ExcelJS from 'exceljs';
import Swal from 'sweetalert2';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from '../../../api/firebaseConfig';

export default function ProductTable() {
    const columns = [
        { name: 'productCode', displayName: 'Mã sản phẩm' },
        { name: 'productName', displayName: 'Tên sản phẩm' },
        { name: '', displayName: 'Giá nhập (kg)' },
        { name: 'price', displayName: 'Đơn giá (kg)' },
        { name: 'productQuantity', displayName: 'Tồn kho (kg)' },
        { name: 'batchCode', displayName: 'Lô hàng' },
        { name: 'importDate', displayName: 'Ngày nhập' },
        { name: '', displayName: 'Nhà cung cấp' },
    ];
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const storage = getStorage(firebase);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const showAlert = (data: any, fileInput: HTMLInputElement) => {
        Swal.fire({
            title: 'Xác nhận thêm danh sách sản phẩm',
            text: 'Bạn có chắc chắn muốn thêm danh sách sản phẩm này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, thêm!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleSubmit(data);
            } else {
                fileInput.value = '';
                Swal.fire('Đã hủy', 'Danh sách không được thêm.', 'info');
            }
        });
    };

    const uploadImageToFirebase = async (imageBuffer: Buffer, fileName: string): Promise<string> => {
        try {
            const fileRef = ref(storage, `images/${fileName}`);
            await uploadBytes(fileRef, imageBuffer);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            return "";
        }
    };

    const fileToBuffer = (file: File): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                resolve(Buffer.from(arrayBuffer));
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) {
                throw new Error("No file selected");
            }

            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we process your file.',
                allowOutsideClick: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            const workbook = new ExcelJS.Workbook();
            const fileBuffer = await fileToBuffer(file);
            await workbook.xlsx.load(fileBuffer);
            const worksheet = workbook.getWorksheet(1);

            const imageMap: { [rowNumber: number]: string } = {};
            const images = workbook.model.media;

            const rows = worksheet?.rowCount;
            if (rows === 0) {
                throw new Error("The worksheet contains no rows");
            }

            const imageRowNumbers = Array.from({ length: images.length }, (_, i) => i + 2);

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const { buffer, name, extension } = image;

                if (buffer) {
                    const fileName = `${name}.${extension}`;
                    const firebaseUrl = await uploadImageToFirebase(Buffer.from(buffer), fileName);

                    const rowNumber = imageRowNumbers[i];
                    if (rows && rowNumber <= rows) {
                        imageMap[rowNumber] = firebaseUrl;
                    }
                }
            }

            const processedData: Array<any> = [];

            const headers = worksheet?.getRow(1).values as string[];

            worksheet?.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowData: { [key: string]: any } = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (colNumber === 4 && imageMap[rowNumber]) {
                        rowData[headers[colNumber]] = imageMap[rowNumber];
                    } else {
                        rowData[headers[colNumber]] = cell.value;
                    }
                });
                processedData.push(rowData);
            });

            Swal.close();

            const fileInput = event.target;
            showAlert(processedData, fileInput);
        } catch (error) {
            console.error("Error processing file:", error);
            Swal.fire('Error processing file', 'error');
        }
    };

    const handleSubmit = async (data: any) => {
        console.log(data);
        try {
            const response = await api.post(`/products/import`, data);
            if (response.status >= 200 && response.status < 300) {
                getProducts(currentPage, currentSearch);
                Swal.fire('Đã thêm!', 'Danh sách đã được thêm.', 'success');
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    }

    const getProducts = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/products/admin/products?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            if (data._embedded) {
                setProducts(data._embedded.adminProductDtoList);
                setTotalPages(data.page.totalPages);
            } else {
                alert("Danh sách rỗng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    useEffect(() => {
        getProducts(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'productCode', label: 'Mã sản phẩm' },
                                { value: 'productName', label: 'Tên sản phẩm' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".xlsx, .xls"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <Button
                                className="ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]"
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                Import
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <ProductList name="Sản phẩm" editUrl="/products/update/1" titles={titles} columns={columns} data={products} tableName="products" />
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
            </section>
            <FloatingButton />
        </div>
    );
};

