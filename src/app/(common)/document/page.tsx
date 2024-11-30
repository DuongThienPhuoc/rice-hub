'use client'

import {
    Page as PDFPage,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    PDFViewer,
} from '@react-pdf/renderer';
import { useSearchParams } from 'next/navigation';
import { currencyHandleProvider } from '@/utils/currency-handle';
import docso from '@/utils/docso';
import { Suspense, useEffect, useState } from 'react';

Font.register({
    family: 'Tinos',
    fonts: [
        {
            src: 'fonts/Tinos-Regular.ttf',
            fontWeight: 300,
        },
        {
            src: 'fonts/Tinos-Bold.ttf',
            fontWeight: 700,
        },
        {
            src: 'fonts/Tinos-Italic.ttf',
            fontWeight: 300,
            fontStyle: 'italic',
        },
        {
            src: 'fonts/Tinos-BoldItalic.ttf',
            fontWeight: 700,
            fontStyle: 'italic',
        },
    ],
});
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 40,
    },
    header_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: 'Tinos',
        fontWeight: 'bold',
    },
    banner_container: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: 'Tinos',
        fontWeight: 'bold',
    },
    address: {
        fontSize: 11,
        fontWeight: 'medium',
        fontFamily: 'Tinos',
    },
    header: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'Tinos',
        textAlign: 'center',
    },
    header_second: {
        fontSize: 11,
        fontWeight: 'light',
        fontFamily: 'Tinos',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    text: {
        width: '90%',
        fontSize: 12,
        fontFamily: 'Tinos',
        fontWeight: 'light',
        marginHorizontal: 'auto',
    },
    signature_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signature: {
        width: '25%',
    },
    signature_title: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Tinos',
    },
    signature_description: {
        fontSize: 11,
        fontWeight: 'light',
        textAlign: 'center',
        fontFamily: 'Tinos',
    },
    footer: {
        marginTop: '70px',
        flexDirection: 'column',
    },
    footer_text: {
        width: '90%',
        fontSize: 11,
        fontWeight: 'light',
        fontFamily: 'Tinos',
        textAlign: 'left',
        marginHorizontal: 'auto',
    },
});

const MyDocument = ({
    totalAmount,
    type,
}: {
    totalAmount: string | null;
    type: string | null;
}) => (
    <Document>
        <PDFPage size="A4" style={styles.page}>
            <View style={styles.header_container}>
                <View>
                    <Text style={styles.address}>Đơn vị:................</Text>
                    <Text style={styles.address}>Địa chỉ:...............</Text>
                </View>
                <View
                    style={{
                        width: '50%',
                    }}
                >
                    <Text style={styles.header}>Mẫu số 02 - TT</Text>
                    <Text style={styles.header_second}>
                        (Ban hành theo thông tư số:200/2014/TT-BTC
                    </Text>
                    <Text style={styles.header_second}>
                        ngày 22/12/2014 của BTC)
                    </Text>
                </View>
            </View>
            <View style={styles.banner_container}>
                <View
                    style={{
                        width: '60%',
                        marginHorizontal: 'auto',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            fontFamily: 'Tinos',
                            textAlign: 'center',
                        }}
                    >
                        Phiếu chi
                    </Text>
                    <Text style={styles.header_second}>
                        Ngày....tháng....năm.......
                    </Text>
                </View>
                <View
                    style={{
                        fontSize: 11,
                        fontWeight: 'light',
                        fontFamily: 'Tinos',
                        textAlign: 'left',
                    }}
                >
                    <Text>Quyển số:..........</Text>
                    <Text>Số:.....................</Text>
                    <Text>Nợ:.....................</Text>
                    <Text>Có:.....................</Text>
                </View>
            </View>
            <View>
                <Text style={styles.text}>
                    Họ và tên người nhận
                    tiền:.............................................................................................................
                </Text>
                <Text style={styles.text}>
                    Địa
                    chỉ:...........................................................................................................................................
                </Text>
                <Text style={styles.text}>{`Lý do chi: ${type}`}</Text>
                <Text style={styles.text}>
                    Số tiền:{' '}
                    {totalAmount &&
                        currencyHandleProvider(parseInt(totalAmount))}{' '}
                    (Viết bằng chữ): {`${docso(totalAmount)} đồng`}
                </Text>
                <Text style={styles.text}>
                    Kèm
                    theo:.........................................................................Chứng
                    từ gốc:
                </Text>
            </View>
            <Text
                style={{
                    textAlign: 'right',
                    fontSize: 11,
                    fontFamily: 'Tinos',
                    fontWeight: 'light',
                    marginVertical: '20px',
                    fontStyle: 'italic',
                }}
            >
                Ngày.....tháng.....năm.......
            </Text>
            <View style={styles.signature_container}>
                <View style={styles.signature}>
                    <Text style={styles.signature_title}>Giám đốc</Text>
                    <Text style={styles.signature_description}>
                        (Ký, họ tên, đóng dấu)
                    </Text>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.signature_title}>Kế toán trưởng</Text>
                    <Text style={styles.signature_description}>
                        (Ký, họ tên)
                    </Text>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.signature_title}>Thủ Quỹ</Text>
                    <Text style={styles.signature_description}>
                        (Ký, họ tên)
                    </Text>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.signature_title}>Người nhận tiền</Text>
                    <Text style={styles.signature_description}>
                        (Ký, họ tên)
                    </Text>
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footer_text}>
                    Đã nhận đủ số tiền (viết bằng chữ)
                    :............................................................................................................
                </Text>
                <Text style={styles.footer_text}>
                    + Tỷ giá ngoại tệ (vàng bạc, đá
                    quý):..........................................................................................................
                </Text>
                <Text style={styles.footer_text}>
                    + Số tiền quy
                    đổi:.........................................................................................................................................
                </Text>
                <Text style={styles.footer_text}>
                    (Liên gửi ra ngoài phải đóng dấu)
                </Text>
            </View>
        </PDFPage>
    </Document>
);

function ExportVoucherPDF() {
    const searchParams = useSearchParams();
    const totalAmount = searchParams.get('totalAmount');
    const type = searchParams.get('type');
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <>
            {loaded && (
                <PDFViewer
                    style={{
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <MyDocument totalAmount={totalAmount} type={type} />
                </PDFViewer>
            )}
        </>
    );
}

export default function Page() {
    return (
        <Suspense fallback={(<></>)}>
            <ExportVoucherPDF />
        </Suspense>
    );
}


