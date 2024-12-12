'use client';

import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    PDFViewer,
} from '@react-pdf/renderer';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderDetail } from '@/data/order';
import { Order } from '@/type/order';
import { currencyHandleProvider } from '@/utils/currency-handle';

Font.register({
    family: 'Tinos',
    fonts: [
        {
            src: '/fonts/Tinos-Regular.ttf',
            fontWeight: 300,
        },
        {
            src: '/fonts/Tinos-Bold.ttf',
            fontWeight: 700,
        },
        {
            src: '/fonts/Tinos-Italic.ttf',
            fontWeight: 300,
            fontStyle: 'italic',
        },
        {
            src: '/fonts/Tinos-BoldItalic.ttf',
            fontWeight: 700,
            fontStyle: 'italic',
        },
    ],
});

const styles = StyleSheet.create({
    headerText: {
        fontSize: 10,
        fontWeight: 300,
        marginBottom: 10,
        color: 'black',
        fontFamily: 'Tinos',
    },
    textBold: {
        fontSize: 10,
        fontWeight: 700,
        marginBottom: 10,
        color: 'black',
        fontFamily: 'Tinos',
    },
    textBoldSecond: {
        fontSize: 8,
        fontWeight: 700,
        marginBottom: 10,
        color: 'black',
        fontFamily: 'Tinos',
    },
    page: {
        width: 226.77,
        padding: 5,
    },
    header: {
        fontSize: 13,
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Tinos',
    },
    header_2: {
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Tinos',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row', // Sử dụng flexDirection để tạo dòng
    },
    col1: {
        flex: 3, // Để các cột có kích thước đều nhau
        borderWidth: '1px',
        borderColor: '#000',
    },
    col2: {
        flex: 1,
        borderWidth: '1px',
        borderColor: '#000',
    },
    col3: {
        flex: 1,
        borderWidth: '1px',
        borderColor: '#000',
    },
    col4: {
        flex: 2,
        borderWidth: '1px',
        borderColor: '#000',
    },
    col5: {
        flex: 2,
        borderWidth: '1px',
        borderColor: '#000',
    },
    tableHead: {
        fontFamily: 'Tinos',
        margin: 1,
        fontWeight: 700,
        fontSize: 8,
    },
    tableData: {
        fontFamily: 'Tinos',
        margin: 1,
        fontSize: 8,
    },
});

const InvoiceDocument = ({ order }: { order: Order }) => {
    return (
        <Document language={'utf8'}>
            <Page size={{ width: 226.77 }} style={styles.page}>
                <Text style={styles.headerText}>{`Ngày: ${new Date(order.orderDate).toLocaleDateString('vi-VN')}`}</Text>
                <Text style={styles.headerText}>
                    {`Số hóa đơn: ${order.orderCode}`}
                </Text>
                <Text style={styles.header_2}>Kho Thanh Quang</Text>
                <Text style={styles.header}>Hoá đơn thanh toán</Text>
                <View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Text style={styles.textBold}>Tên khách hàng: </Text>
                        <Text style={styles.headerText}>
                            {order.customer.name}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Text style={styles.textBold}>Địa chỉ: </Text>
                        <Text style={styles.headerText}>
                            {order.customer.address}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Text style={styles.textBold}>Số điện thoại: </Text>
                        <Text style={styles.headerText}>
                            {order.customer.phone}
                        </Text>
                    </View>
                </View>
                {/*Table*/}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.col1}>
                            <Text style={styles.tableHead}>Tên hàng</Text>
                        </View>
                        <View style={styles.col2}>
                            <Text style={styles.tableHead}>Quy cách</Text>
                        </View>
                        <View style={styles.col3}>
                            <Text style={styles.tableHead}>SL</Text>
                        </View>
                        <View style={styles.col4}>
                            <Text style={styles.tableHead}>Đơn giá</Text>
                        </View>
                        <View style={styles.col5}>
                            <Text style={styles.tableHead}>Thành tiền</Text>
                        </View>
                    </View>
                    {order.orderDetails.map((orderDetail, index) => (
                        <View style={styles.tableRow} key={index}>
                            <View style={styles.col1}>
                                <Text style={styles.tableData}>
                                    {orderDetail.name}
                                </Text>
                            </View>
                            <View style={styles.col2}>
                                <Text
                                    style={styles.tableData}
                                >{`${orderDetail.weightPerUnit} kg`}</Text>
                            </View>
                            <View style={styles.col3}>
                                <Text style={styles.tableData}>
                                    {orderDetail.quantity}
                                </Text>
                            </View>
                            <View style={styles.col4}>
                                <Text style={styles.tableData}>
                                    {currencyHandleProvider(
                                        orderDetail.unitPrice,
                                    )}
                                </Text>
                            </View>
                            <View style={styles.col5}>
                                <Text style={styles.tableData}>
                                    {currencyHandleProvider(
                                        orderDetail.totalPrice,
                                    )}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                {/*End Table*/}
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}
                >
                    <Text style={styles.textBoldSecond}>Thành tiền: </Text>
                    <Text style={styles.headerText}>
                        {currencyHandleProvider(
                            order.totalAmount,
                        )}
                    </Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                    }}
                >
                    <Text style={styles.textBoldSecond}>Giảm giá: </Text>
                    <Text style={styles.headerText}>
                        {currencyHandleProvider(0)}
                    </Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: '#000',
                    }}
                >
                    <Text style={styles.textBoldSecond}>VAT: </Text>
                    <Text style={styles.headerText}>
                        {currencyHandleProvider(0)}
                    </Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}
                >
                    <Text style={styles.textBold}>Tổng tiền: </Text>
                    <Text style={styles.headerText}>{currencyHandleProvider(
                        order.totalAmount,
                    )}</Text>
                </View>
                {/*Footer*/}
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 10,
                    }}
                >
                    <Text style={styles.headerText}>Cảm ơn quý khách hàng</Text>
                </View>
            </Page>
        </Document>
    );
};

function LoaderInvoice() {
    const [loaded, setLoaded] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | undefined>();

    async function fetchOrderDetail() {
        try {
            const response = await getOrderDetail(orderId || '');
            if (response.status === 200) {
                setOrder(response.data);
            } else {
                console.error({ data: response.data, status: response.status });
            }
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message || 'Unexpected error occurred');
            }
        }
    }

    useEffect(() => {
        setLoaded(true);
        fetchOrderDetail().catch((e) => console.error(e));
    }, []);

    return (
        <>
            {loaded && order && (
                <PDFViewer
                    style={{
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <InvoiceDocument order={order} />
                </PDFViewer>
            )}
        </>
    );
}

export default function InvoicePage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <LoaderInvoice />
        </Suspense>
    );
}
