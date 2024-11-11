/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Invoice = () => {
    return (
        <div className="w-[970px] my-[20px] mx-auto">
            <div className="invoice-header">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Hóa đơn nhập hàng</h1>
                        <h4 className="text-lg font-light mt-1">NO: 554775/R1 | Date: 01/01/2015</h4>
                    </div>
                    <div className="text-right">
                        <div className="flex justify-end items-start">
                            <img className="pr-4 my-2 mx-auto" alt='logo công ty' src="" />
                            <ul className="text-left">
                                <li><strong>Tên công ty</strong></li>
                                <li>Địa chỉ</li>
                                <li>demo@gmail.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white px-5 py-5 my-10 shadow-2xl rounded-lg'>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold">Chi tiết công ty</h3>
                        <ul className="mt-4 space-y-2">
                            <li><strong>Tên:</strong> RCJA</li>
                            <li><strong>Địa chỉ:</strong> 1 Unknown Street VIC</li>
                            <li><strong>Số điện thoại:</strong> (+61)404123123</li>
                            <li><strong>Email:</strong> admin@rcja.com</li>
                            <li><strong>Người liên hệ:</strong> John Smith</li>
                        </ul>
                    </div>
                    <div className="border rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold">Chi tiết khách hàng</h3>
                        <ul className="mt-4 space-y-2">
                            <li><strong>Tên:</strong> RCJA</li>
                            <li><strong>Địa chỉ:</strong> 1 Unknown Street VIC</li>
                            <li><strong>Số điện thoại:</strong> (+61)404123123</li>
                            <li><strong>Email:</strong> admin@rcja.com</li>
                            <li><strong>Người liên hệ:</strong> John Smith</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8">
                    <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tổng cộng</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thuế</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tổng chi phí</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 text-sm">
                                    Tên sản phẩm
                                    <br />
                                    <small className="text-gray-500">Mô tả sản phẩm</small>
                                </td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <span className="font-mono">50 bao</span>
                                    <br />
                                    <small className="text-gray-500">Khối lượng 1 tấn</small>
                                </td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <span className="font-mono">$1,000.000</span>
                                    <br />
                                    <small className="text-gray-500">Chưa bao gồm VAT</small>
                                </td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <span className="font-mono">$18,000.00</span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <span className="font-mono">- $1,800.00</span>
                                    <br />
                                    <small className="text-gray-500">Đặc biệt -10%</small>
                                </td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <span className="font-mono">+ $3,240.00</span>
                                    <br />
                                    <small className="text-gray-500">VAT 20%</small>
                                </td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <strong className="font-mono">$19,440.00</strong>
                                    <br />
                                    <small className="text-gray-500">$16,200.00</small>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tổng:</th>
                                <th colSpan={3}></th>
                                <th className="px-6 py-3 text-center">$500</th>
                                <th className="px-6 py-3 text-center">$800</th>
                                <th className="px-6 py-3 text-center">$20,000.00</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-8">
                    <div className="border rounded-lg shadow p-4 text-center">
                        <small className="text-gray-500">Tổng giá trị đơn hàng:</small>
                        <p className="text-5xl font-bold">$5,000.25</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="border rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold">Chi tiết thanh toán</h3>
                        <p><strong>Tên tài khoản:</strong>RJCA</p>
                        <p><strong>Tên ngân hàng:</strong>BIDV</p>
                        <p><strong>Số tài khoản:</strong> 1234101</p>
                        <p><strong>Trạng thái:</strong> Chưa thanh toán</p>
                    </div>
                    <div className="border rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold">Ghi chú</h3>
                        <p>Yêu cầu thanh toán trong vòng 15 ngày kể từ ngày nhận được hóa đơn này.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;