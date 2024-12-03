import CryptoJS from "crypto-js";

interface Payload {
    amount: number;
    orderCode: number;
    description: string;
    cancelUrl: string;
    returnUrl: string;
}

export const generateChecksum = (payload: Payload, checksumKey: string): string => {
    const plainText = `amount=${payload.amount}&cancelUrl=${payload.cancelUrl}&description=${payload.description}&orderCode=${payload.orderCode}&returnUrl=${payload.returnUrl}`;
    const checksum = CryptoJS.HmacSHA256(plainText, checksumKey).toString(CryptoJS.enc.Hex);
    return checksum;
};

export const generateOrderCode = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const orderCode = timestamp * 1000 + randomNum;
    if (orderCode > 9007199254740991) {
        return orderCode % 9007199254740991;
    }
    return orderCode;
};
