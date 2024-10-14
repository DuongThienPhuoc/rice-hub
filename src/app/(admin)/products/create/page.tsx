// /* eslint-disable @next/next/no-img-element */
// 'use client';
// import InputField from '@/components/field/inputfield';
// import Navbar from '@/components/navbar/navbar';
// import Sidebar from '@/components/navbar/sidebar';
// import { Button } from '@/components/ui/button';
// import React, { DragEvent, useEffect, useState } from 'react';
// import returnIcon from '@/components/icon/chevron_left.svg';
// import Image from "next/image";

// const Page = () => {

//     const [navbarVisible, setNavbarVisible] = useState(false);
//     const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//     const [formData, setFormData] = useState<Record<string, string | number>>({
//         productCode: '',
//         productName: '',
//         quantity: '',
//         entryDate: '',
//         batch: '',
//         supplier: '',
//         image: '',
//     });

//     const titles = [
//         { name: 'productCode', displayName: 'Mã sản phẩm', type: 'text' },
//         { name: 'productName', displayName: 'Tên sản phẩm', type: 'text' },
//         { name: 'quantity', displayName: 'Số lượng (kg)', type: 'number' },
//         { name: 'entryDate', displayName: 'Ngày nhập kho', type: 'date' },
//         { name: 'batch', displayName: 'Lô hàng', type: 'text' },
//         { name: 'supplier', displayName: 'Nhà cung cấp', type: 'text' },
//     ];

//     const handleFieldChange = (field: string, value: string) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             [field]: value,
//         }));
//     };

//     useEffect(() => {
//         const updateNavbarVisibility = () => {
//             const shouldShowNavbar = window.innerWidth >= 1100;
//             setNavbarVisible(shouldShowNavbar);
//         };

//         updateNavbarVisibility();

//         window.addEventListener('resize', updateNavbarVisibility);

//         return () => {
//             window.removeEventListener('resize', updateNavbarVisibility);
//         };
//     }, []);

//     const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         const files = Array.from(e.dataTransfer.files);
//         updateImagePreviews([files[0]]);
//     };

//     const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = Array.from(e.target.files || []);
//         updateImagePreviews(files);
//     };

//     const updateImagePreviews = (files: File[]) => {
//         const newPreviews: string[] = [];
//         files.forEach((file) => {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 if (typeof e.target?.result === 'string') {
//                     newPreviews.push(e.target.result);
//                     setImagePreviews(newPreviews);
//                 }
//             };
//             reader.readAsDataURL(file);
//         });
//     };
//     return (
//         <div>
//             {navbarVisible ? (
//                 <Navbar />
//             ) : (
//                 <Sidebar />
//             )}
//             <div className='flex my-16 justify-center px-5 w-full'>
//                 <div className='w-[95%] md:w-[70%] flex bg-white rounded-lg flex-col lg:flex-row' style={{ boxShadow: '5px 5px 5px lightgray' }}>
//                     <div className='flex-1 min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100'>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             onChange={handleFileChange}
//                             className='hidden'
//                             id="file-input"
//                         />
//                         <label
//                             htmlFor="file-input"
//                             className='w-full h-full flex flex-col items-center justify-center'
//                             onDragOver={(e) => handleDragOver(e as unknown as DragEvent<HTMLDivElement>)}
//                             onDrop={(e) => handleDrop(e as unknown as DragEvent<HTMLDivElement>)}
//                         >
//                             <p className='text-gray-500'>Drag & drop your images here or click to upload</p>
//                             <p className='text-sm text-gray-400'>Max file size: 2MB</p>
//                         </label>
//                         <div className='mt-4 max-w-[500px] max-h-[500px]'>
//                             {imagePreviews.map((src, index) => (
//                                 <img
//                                     key={index}
//                                     src={src}
//                                     alt={`preview-${index}`}
//                                     className='max-w-full max-h-full object-contain rounded-lg'
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                     <div className='flex-1'>
//                         <div className='py-10 px-10 h-full flex flex-col justify-between items-center lg:items-start'>
//                             <InputField titles={titles} data={formData} onFieldChange={handleFieldChange} />
//                             <div className='w-full'>
//                                 <div className='w-full flex justify-center align-bottom items-center mt-10'>
//                                     <Button className='ml-2 mt-4 lg:mt-0 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
//                                         Thêm
//                                     </Button>
//                                 </div>
//                                 <div className='w-full flex justify-center align-bottom items-center mt-5'>
//                                     <a href='/products' className='flex items-center'>
//                                         <Image src={returnIcon} alt='return icon' width={12} height={12} className='min-h-[12px] min-w-[12px] mr-2' />
//                                         Quay lại
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Page;