/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from '@/lib/utils';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import firebase from '@/config/firebaseConfig';
import html2canvas from 'html2canvas';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { jsPDF } from 'jspdf';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { ToastAction } from '@radix-ui/react-toast';
import { useToast } from '@/hooks/use-toast';

const Page = ({ params }: { params: { id: number } }) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmit, setIsSubmit] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [duration, setDuration] = useState(1);
    const [location, setLocation] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [count, setCount] = useState(2);
    const [onPageChange, setOnPageChange] = useState(false);

    const [buyer, setBuyer] = useState({
        address: '',
        phone: '',
        name: '',
        position: '',
        taxCode: '',
        bankNumber: '',
        bank: '',
    });

    const [seller, setSeller] = useState({
        address: '',
        phone: '',
        name: '',
        position: 'Tổng giám đốc',
        taxCode: '',
        bankNumber: '',
        bank: '',
    });

    useEffect(() => {
        const today = new Date();
        const date = `${today.getDate()}`.padStart(2, '0');
        const month = `${today.getMonth() + 1}`.padStart(2, '0');
        const year = today.getFullYear();

        setCurrentDate(`Ngày ${date} tháng ${month} năm ${year}`);
        getUser();
    }, []);

    useEffect(() => {
        if (isSubmit === true) {
            handleSubmit();
        }
    }, [isSubmit])

    const getUser = async () => {
        try {
            const username = localStorage.getItem('username');
            const url = `/user/get/${username}`;
            const response = await api.get(url);
            const data = response.data;
            setSeller({
                name: data.name,
                address: data.address,
                phone: data.phone,
                position: 'Tổng giám đốc',
                taxCode: '',
                bankNumber: '',
                bank: '',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hệ thống gặp sự cố khi lấy thông tin người dùng!',
                description: 'Xin vui lòng thử lại sau',
                duration: 3000
            })
        }
    };

    useEffect(() => {
        const getCustomer = async () => {
            try {
                const url = `/customer/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                if (!data?.id) {
                    toast({
                        variant: 'destructive',
                        title: 'Lỗi khi lấy thông tin khách hàng!',
                        description: 'Xin vui lòng thử lại',
                        duration: 3000
                    })
                }
                setBuyer({
                    name: data.fullName,
                    address: data.address,
                    phone: data.phone,
                    position: '',
                    taxCode: '',
                    bankNumber: '',
                    bank: '',
                });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Hệ thống gặp sự cố khi lấy thông tin khách hàng!',
                    description: 'Xin vui lòng thử lại sau',
                    duration: 3000
                })
            }
        };

        if (params.id) {
            getCustomer();
        }
    }, [params.id]);

    const handleSubmit = async () => {
        if (duration < 1) {
            setIsSubmit(false);
            setOnPageChange(false);
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại!',
                description: 'Hợp đồng phải có thời hạn ít nhất là 1 tháng.',
                duration: 3000
            });
            return;
        }

        setOnPageChange(true);

        const storage = getStorage(firebase);
        const element = document.getElementById('contract');
        if (!element) {
            setIsSubmit(false);
            setOnPageChange(false);
            return;
        }
        const canvas = await html2canvas(element, { scale: 2 });
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const padding = 10;

        const contentWidth = pdfWidth - 2 * padding;
        const contentHeight = pdfHeight - 8 * padding;

        const canvasHeight = canvas.height;
        const canvasWidth = canvas.width;
        const pageHeightInCanvasUnits = (contentHeight / contentWidth) * canvasWidth;

        let position = 0;

        while (position < canvasHeight) {
            const canvasSlice = document.createElement('canvas');
            canvasSlice.width = canvasWidth;
            canvasSlice.height = pageHeightInCanvasUnits;

            const ctx = canvasSlice.getContext('2d');
            if (!ctx) {
                setIsSubmit(false);
                setOnPageChange(false);
                return;
            }
            ctx.drawImage(canvas, 0, -position, canvasWidth, canvasHeight);

            const sliceImage = canvasSlice.toDataURL('image/png');

            pdf.addImage(sliceImage, 'PNG', padding, padding, contentWidth, contentHeight);

            position += pageHeightInCanvasUnits;

            if (position < canvasHeight) {
                pdf.addPage();
            }
        }
        const pdfBlob = pdf.output('blob');
        const storageRef = ref(storage, `contracts/Contract_${Date.now()}.pdf`);
        await uploadBytes(storageRef, pdfBlob);

        const downloadURL = await getDownloadURL(storageRef);

        const formData = {
            duration: duration,
            customerId: params.id,
            pdfFilePath: downloadURL,
        }

        setOnPageChange(true);
        try {
            const response = await api.post(`/contracts/createContract`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Tạo thành công!',
                    description: 'Hợp đồng đẫ được tạo thành công',
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                });
                router.push(`/customers/${params.id}`);
                setOnPageChange(false);
                setIsSubmit(false);
            } else {
                setOnPageChange(false);
                setIsSubmit(false);
                toast({
                    variant: 'destructive',
                    title: 'Tạo thất bại!',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    duration: 3000
                });
            }
        } catch (error: any) {
            setOnPageChange(false);
            setIsSubmit(false);
            const messages = error?.response?.data?.message || ['Đã xảy ra lỗi, vui lòng thử lại.'];
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: (
                    <div>
                        {Array.isArray(messages) ? (
                            messages.map((msg: any, index: any) => (
                                <div key={index}>{msg}</div>
                            ))
                        ) : (
                            <div>{messages}</div>
                        )}
                    </div>
                ),
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            });
        }
    };

    const handleBuyerChange = (field: any, value: any) => {
        setBuyer(prevBuyer => ({
            ...prevBuyer,
            [field]: value,
        }));
    };

    const handleSellerChange = (field: any, value: any) => {
        setSeller(prevSeller => ({
            ...prevSeller,
            [field]: value,
        }));
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div id='contract' className="my-[20px] p-[20px] max-w-[1134px] bg-white">
                <div className="text-center mb-[20px]">
                    <h1 className='text-[18px] uppercase font-bold'>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
                    <p className='text-[16px]'>Độc lập - Tự do - Hạnh phúc</p>
                    <hr className="my-[10px] border-[#000] border" />
                    <h2 className='text-[18px] mt-[10px] font-bold'>HỢP ĐỒNG MUA BÁN HÀNG HOÁ</h2>
                </div>

                <div className="p-[20px]">
                    <div>
                        <p>- Căn cứ Bộ Luật Dân sự được Quốc hội nước Cộng hoà xã hội chủ nghĩa Việt Nam thông qua ngày 14 tháng 6 năm 2005;</p>
                        <p>- Căn cứ nhu cầu và khả năng của hai bên.</p>
                        <div className='flex items-center'>Hôm nay, {currentDate}, tại
                            {isSubmit ? (
                                <p className='mx-4 w-[200px]'>{location}</p>
                            ) : (
                                <TextField
                                    type={'text'}
                                    value={location || ''}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className='mx-4'
                                    variant="standard" />
                            )}
                            Chúng tôi gồm có:</div>

                        <div className='flex mt-5 space-x-2'>
                            <div className="my-[10px] flex-1">
                                <div className='space-y-2 sm:w-[70%] w-full'>
                                    <h3 className='font-bold mb-2 text-[18px]'>BÊN BÁN:</h3>
                                    <div className='flex justify-between items-center'>
                                        Địa chỉ:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.address}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.address || ''}
                                                onChange={(e) => handleSellerChange('address', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Điện thoại:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.phone}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.phone || ''}
                                                onChange={(e) => handleSellerChange('phone', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Đại diện bởi:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.name}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.name || ''}
                                                onChange={(e) => handleSellerChange('name', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Chức vụ:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.position}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.position || ''}
                                                onChange={(e) => handleSellerChange('position', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Mã số thuế:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.taxCode}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.taxCode || ''}
                                                onChange={(e) => handleSellerChange('taxCode', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Tài khoản số:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.bankNumber}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.bankNumber || ''}
                                                onChange={(e) => handleSellerChange('bankNumber', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Ngân hàng:
                                        {isSubmit ? (
                                            <p className='mx-2'>{seller?.bank}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={seller?.bank || ''}
                                                onChange={(e) => handleSellerChange('bank', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <p className='pt-5'><strong>Sau đây gọi tắt là Bên A</strong></p>
                                </div>
                            </div>
                            <div className="my-[10px] flex-1">
                                <div className='space-y-2 sm:w-[70%] w-full'>
                                    <h3 className='font-bold mb-2 text-[18px]'>BÊN MUA:</h3>
                                    <div className='flex justify-between items-center'>
                                        Địa chỉ:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.address}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.address || ''}
                                                onChange={(e) => handleBuyerChange('address', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Điện thoại:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.phone}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.phone || ''}
                                                onChange={(e) => handleBuyerChange('phone', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Đại diện bởi:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.name}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.name || ''}
                                                onChange={(e) => handleBuyerChange('name', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Chức vụ:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.position}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.position || ''}
                                                onChange={(e) => handleBuyerChange('position', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Mã số thuế:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.taxCode}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.taxCode || ''}
                                                onChange={(e) => handleBuyerChange('taxCode', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Tài khoản số:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.bankNumber}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.bankNumber || ''}
                                                onChange={(e) => handleBuyerChange('bankNumber', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        Ngân hàng:
                                        {isSubmit ? (
                                            <p className='mx-2'>{buyer?.bank}</p>
                                        ) : (
                                            <TextField
                                                type={'text'}
                                                value={buyer?.bank || ''}
                                                onChange={(e) => handleBuyerChange('bank', e.target.value)}
                                                className='mx-2'
                                                variant="standard" />
                                        )}
                                    </div>
                                    <p className='pt-5'><strong>Sau đây gọi tắt là Bên B</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className='font-bold mb-2 text-[18px]'>ĐIỀU 1: ĐỐI TƯỢNG</h3>
                    <div className='px-5'>
                        <p>
                            <strong>1.1.</strong> Bên A đồng ý bán và bên B đồng ý mua hàng hóa không giới hạn loại sản phẩm, được xác định theo nhu cầu và yêu cầu của bên B trong suốt thời hạn hợp đồng.
                        </p>
                        <p>
                            <strong>1.2.</strong> Hàng hoá do Bên Bán cung cấp phải đảm bảo đúng chất lượng (Có Giấy chứng nhẫn hàng hoá cung cấp đạt tiêu chuẩn chất lượng của cơ quan Nhà nước có thẩm quyền)
                        </p>
                    </div>


                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 2: THỜI HẠN HỢP ĐỒNG</h3>
                    <div className='px-5'>
                        <div className='flex items-center'>Thời hạn Hợp đồng là:
                            {isSubmit ? (
                                <p className='mx-4 min-w-[50px] max-w-[100px]'>{duration}</p>
                            ) : (
                                <TextField
                                    type={'number'}
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                    className='mx-4 max-w-[100px]'
                                    variant="standard" />
                            )}
                            tháng kể từ ngày
                            {isSubmit ? (
                                <p className='mx-4 w-[150px]'>{fromDate}</p>
                            ) : (
                                <TextField
                                    type={'date'}
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className='mx-4'
                                    variant="standard" />
                            )}
                            đến hết ngày
                            {isSubmit ? (
                                <p className='mx-4 w-[150px]'>{toDate}</p>
                            ) : (
                                <TextField
                                    type={'date'}
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className='mx-4'
                                    variant="standard" />
                            )}
                        </div>
                        <p>Hai bên có thể thỏa thuận gia hạn hợp đồng trước khi hết hạn.</p>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 3: GIÁ CẢ VÀ PHƯƠNG THỨC THANH TOÁN</h3>
                    <div className='px-5'>
                        <p><strong>3.1.</strong> Giá cả: Giá hàng hóa sẽ được xác định theo từng lần đặt hàng cụ thể và dựa trên bảng báo giá hiện hành của bên A.</p>
                        <p><strong>3.2.</strong> Phương thức thanh toán: Thanh toán bằng tiền mặt hoặc chuyển khoản.</p>
                        <p><strong>3.3.</strong> Thời gian thanh toán: Trong vòng [số ngày] kể từ ngày nhận được hóa đơn của bên A.</p>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 4: THỜI ĐIỂM VÀ ĐỊA ĐIỂM CHUYỂN GIAO TÀI SẢN</h3>
                    <div className='px-5'>
                        <p><strong>4.1.</strong> Phương thức giao hàng: Bên A sẽ giao hàng đến địa điểm do bên B yêu cầu hoặc tại kho của bên B.</p>
                        <p><strong>4.2.</strong> Thời gian giao hàng: Bên A sẽ giao hàng trong vòng [số ngày] kể từ khi nhận được yêu cầu đặt hàng của bên B.</p>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</h3>
                    <div className='px-5'>
                        <p className="underline font-bold">5.1. Quyền và nghĩa vụ của bên A:</p>
                        <div className='px-5'>
                            <p><span className='font-semibold'>5.1.1.</span> Cung cấp hàng hóa đảm bảo chất lượng và phù hợp với yêu cầu của bên B.</p>
                            <p><span className='font-semibold'>5.1.2.</span> Đảm bảo giao hàng đúng thời hạn và đúng địa điểm như đã thỏa thuận.</p>
                        </div>

                        <p className="underline font-bold">5.2. Quyền và nghĩa vụ của bên B:</p>
                        <div className='px-5'>
                            <p><span className='font-semibold'>5.2.1.</span> Thanh toán đầy đủ và đúng hạn.</p>
                            <p><span className='font-semibold'>5.2.2.</span> Kiểm tra và nhận hàng hóa theo các tiêu chuẩn đã thỏa thuận.</p>
                        </div>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 6: ĐIỀU KHOẢN BẢO MẬT</h3>
                    <div className='px-5'>
                        <p>Hai bên cam kết bảo mật mọi thông tin liên quan đến hợp đồng và chỉ sử dụng thông tin cho mục đích thực hiện hợp đồng này.</p>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 7: PHẠT HỢP ĐỒNG VÀ BỒI THƯỜNG THIỆT HẠI</h3>
                    <div className='px-5'>
                        <p className="underline font-bold">7.1. Đối với bên A:</p>
                        <div className='px-5'>
                            <p><span className='font-semibold'>7.1.1.</span> Nếu bên A không giao hàng đúng thời hạn quy định tại Hợp đồng này thì sẽ bị phạt số tiền là 0,05% Tổng giá trị Hợp đồng cho 01 ngày vi phạm.</p>
                            <p><span className='font-semibold'>7.1.2.</span> Nếu bên A không giao đủ hàng đúng số lượng và chất lượng theo quy định tại Hợp đồng này thì sẽ phải cung cấp tiếp hàng hoá theo đúng quy định và bị phạt số tiền là 0,05% Tổng giá trị hàng hoá bị vi phạm cho 01 ngày chậm.</p>
                        </div>
                        <p className="underline font-bold">7.2. Đối với bên B:</p>
                        <div className='px-5'>
                            <p><span className='font-semibold'>7.2.1.</span> Nếu bên B không thực hiện đúng nghĩa vụ thanh toán theo qui định tại Hợp đồng này thì sẽ bị phạt số tiền là 0,05% Tổng giá trị Hợp đồng cho 01 ngày vi phạm.</p>
                            <p><span className='font-semibold'>7.2.2.</span> Nếu bên B không thực hiện đúng nghĩa vụ tiếp nhận hàng theo qui định của Hợp đồng này thì sẽ bị phạt số tiền là 0,05% Tổng giá trị Hợp đồng cho 01 ngày vi phạm.</p>
                        </div>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 8: GIẢI QUYẾT TRANH CHẤP</h3>
                    <div className='px-5'>
                        <p>Trong quá trình thực hiện Hợp đồng này nếu xảy ra bất kỳ sự bất đồng nào, Bên nảy sinh bất đồng sẽ thông báo cho bên kia bằng văn bản. Hai bên sẽ thương lượng để giải quyết các bất đồng đó. Trường hợp các bên không tự thương lượng được thì sự việc sẽ được đưa ra giải quyết theo qui định của pháp luật.</p>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 9: CÁC TRƯỜNG HỢP CHẤM DỨT HỢP ĐỒNG</h3>
                    <div className='px-5'>
                        <p>Hợp đồng này sẽ được chấm dứt trong các trường hợp sau:</p>
                        <p>- Khi các Bên thực hiện xong các quyền và nghĩa vụ quy định trong Hợp đồng này.</p>
                        <p>- Khi một Bên vi phạm hợp đồng dẫn đến Hợp đồng không thể thực hiện được thì phía Bên kia có quyền đơn phương chấm dứt hợp đồng.</p>
                        <p>- Hợp đồng có thể được chấm dứt do sự thỏa thuận của các Bên.</p>
                    </div>

                    <h3 className='font-bold mb-2 mt-4 text-[18px]'>ĐIỀU 10: HIỆU LỰC THI HÀNH</h3>
                    <div className='px-5'>
                        <p>Hợp đồng này có hiệu lực kể từ ngày ký, và chỉ được coi là kết thúc khi các Bên đã hoàn thành các nghĩa vụ của mình trong Hợp đồng. Trong trường hợp một Bên muốn sửa đổi các điều khoản trong hợp đồng thì phải thông báo cho Bên kia biết trước ít nhất là 03 ngày và cùng nhau thoả thuận lại những điểm cần thay đổi với sự đồng ý của hai Bên.</p>
                        <div className='flex items-center'>Hợp đồng này được lập thành
                            {isSubmit ? (
                                <p className='w-[50px] mx-4 text-center'>{count}</p>
                            ) : (
                                <TextField
                                    type={'number'}
                                    value={count}
                                    onChange={(e) => setCount(Number(e.target.value))}
                                    inputProps={{ min: 2, style: { textAlign: 'center' } }}
                                    className='mx-4 max-w-[100px]'
                                    variant="standard" />
                            )}
                            bản, mỗi Bên giữ
                            {isSubmit ? (
                                <p className='w-[50px] mx-4 text-center'>{Math.floor(count / 2)}</p>
                            ) : (
                                <TextField
                                    type={'number'}
                                    value={Math.floor(count / 2)}
                                    inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                    className='mx-4 max-w-[100px]'
                                    variant="standard" />
                            )}
                            bản, các bản có giá trị pháp lý như nhau. </div>
                    </div>
                </div>

                <div className="mt-10">
                    <div className='flex justify-end mb-4 font-semibold'>Hà Nội, {currentDate}</div>
                    <div className="flex justify-evenly mb-36">
                        <div>
                            <p><strong>ĐẠI DIỆN BÊN A</strong></p>
                        </div>
                        <div>
                            <p><strong>ĐẠI DIỆN BÊN B</strong></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex w-full justify-end space-x-5 mb-10 px-[20%]'>
                <button className={cn("rounded-lg px-4 py-2 bg-[#4ba94d] hover:bg-green-500 text-white font-semibold")}
                    onClick={() => {
                        window.history.back();
                        setOnPageChange(true)
                    }}>Trở về
                </button>
                <button className={cn("rounded-lg px-4 py-2 bg-[#4ba94d] hover:bg-green-500 text-white font-semibold")}
                    onClick={() => {
                        setIsSubmit(true);
                    }}>Tạo hợp đồng
                </button>
            </div>
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0 left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
};

export default Page;