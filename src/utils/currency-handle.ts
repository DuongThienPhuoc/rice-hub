export function currencyHandleProvider(currency: number) {
    const formater = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formater.format(currency);
}
