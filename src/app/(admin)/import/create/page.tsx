// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// 'use client';
// import Navbar from '@/components/navbar/navbar';
// import Sidebar from '@/components/navbar/sidebar';
// import { Button } from '@/components/ui/button';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from "../../../../api/axiosConfig";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import firebase from '../../../../api/firebaseConfig';

// const Page = () => {
//     const router = useRouter();
//     const [navbarVisible, setNavbarVisible] = useState(false);
//     const [formData, setFormData] = useState<Record<string, string | boolean | number>>({
//         name: '',
//         email: '',
//         username: '',
//         password: '',
//         phone: '',
//         address: '',
//         dateOfBirth: '',
//         userType: 'ROLE_EMPLOYEE',
//         employeeRoleId: '',
//         description: '',
//         active: true,
//         gender: '',
//         salaryType: 'DAILY',
//         dailyWage: '0',
//         bankName: '',
//         bankNumber: '',
//     });

//     const handleFieldChange = (field: string, value: string | number | boolean) => {
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

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             const storage = getStorage(firebase);
//             const fileInput = document.getElementById("fileInput") as HTMLInputElement;
//             const file = fileInput?.files?.[0];
//             let updatedFormData = { ...formData };

//             if (file) {
//                 const storageRef = ref(storage, `images/${file.name}`);
//                 const snapshot = await uploadBytes(storageRef, file);
//                 console.log('Uploaded a file!');
//                 const downloadURL = await getDownloadURL(snapshot.ref);
//                 console.log('File available at', downloadURL);

//                 updatedFormData = {
//                     ...updatedFormData,
//                     image: downloadURL,
//                 };
//             }

//             const response = await api.post(`/user/create`, updatedFormData);
//             if (response.status >= 200 && response.status < 300) {
//                 alert(`Nhân viên đã được thêm thành công`);
//                 router.push("/employees");
//             } else {
//                 throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
//             }
//         } catch (error) {
//             console.error('Error submitting form:', error);
//             alert('Đã xảy ra lỗi, vui lòng thử lại.');
//         }
//     };


//     return (
//         <div>
//             {navbarVisible ? <Navbar /> : <Sidebar />}
//             <form onSubmit={handleSubmit} className='flex my-16 justify-center px-5 w-full font-arsenal'>
//                 <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
//                     <div
//                         className={`w-[100%] mt-5 text-center lg:mt-10 p-[7px] text-white bg-black hover:bg-[#1d1d1fca]}`}
//                         style={{ boxShadow: '3px 3px 5px lightgray' }}
//                     >
//                         <strong>Thông tin phiếu nhập</strong>
//                     </div>
//                     <div className='flex mt-10 flex-col lg:flex-row lg:px-10 px-2'>
//                         <div className='m-5 flex-3 flex flex-col lg:flex-row'>
//                             <span className='font-bold flex-1'>Tên nhân viên: </span>
//                             <input
//                                 className='flex-[2] mt-2 lg:mt-0 focus:outline-none px-2 border-gray-200 focus:border-black border-b-2'
//                                 type='text'
//                                 name='name'
//                                 placeholder='Chọn hoặc thêm sản phẩm mới'
//                             />
//                         </div>
//                         <div className='m-10 flex-1 flex flex-col lg:flex-row'>
//                         </div>
//                         <div className='m-10 flex-1 flex flex-col lg:flex-row'>
//                         </div>
//                         <div className='m-10 flex-1 flex flex-col lg:flex-row'>
//                         </div>
//                         <div className='m-10 flex-1 flex flex-col lg:flex-row'>
//                         </div>
//                     </div>
//                     <div className='flex flex-col lg:flex-row lg:px-10 mt-10 px-2'>
//                         <div className='flex-1'>
//                             <div className='m-10 flex flex-col lg:flex-row'>

//                             </div>

//                         </div>
//                         <div className='flex-1'>
//                             <div className='mx-10 mb-10 mt-0 lg:m-10 flex flex-col lg:flex-row'>

//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-full flex justify-center align-bottom items-center my-10'>
//                         <Button type='submit' className='mr-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
//                             <strong>Thêm</strong>
//                         </Button>
//                         <Button type='button' onClick={() => router.push("/employees")} className='ml-2 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
//                             <strong>Hủy</strong>
//                         </Button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Page;
