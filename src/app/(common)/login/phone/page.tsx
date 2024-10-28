'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { loginFormSchema, otpFormSchema } from '@/schema/login-form';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
    PhoneAuthProvider,
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithCredential,
} from '@firebase/auth';
import app from '@/api/firebaseConfig';
import React, { useState } from 'react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = false;

export default function LoginPage() {
    const [showVerifyCodeForm, setShowVerifyCodeForm] =
        React.useState<boolean>(false);
    const [verificationId, setVerificationId] = useState<string>('');
    return (
        <Card className="w-full max-w-xl">
            <CardHeader className="space-y-1">
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription className="text-[16px]">
                    Vui lòng nhập số điện thoại
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!showVerifyCodeForm ? (
                    <PhoneForm
                        setShowVerifyCodeForm={setShowVerifyCodeForm}
                        setVerificationId={setVerificationId}
                    />
                ) : (
                    <OTPInput verificationId={verificationId} />
                )}
            </CardContent>
        </Card>
    );
}

function PhoneForm({
    setShowVerifyCodeForm,
    setVerificationId,
}: {
    setShowVerifyCodeForm: (value: boolean) => void;
    setVerificationId: (value: string) => void;
}) {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    async function handleSendPhoneNumber(
        values: z.infer<typeof loginFormSchema>,
    ) {
        try {
            const appVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'normal', // "visible" or "normal"
                },
            );
            setPhoneNumber(values.phoneNumber);
            let phoneNumber = values.phoneNumber;
            if (phoneNumber.startsWith('0')) {
                phoneNumber = '+84' + phoneNumber.substring(1);
            }
            const response = await signInWithPhoneNumber(
                getAuth(),
                phoneNumber,
                appVerifier,
            );
            setVerificationId(response.verificationId);
            setPhoneNumber('');
            setShowVerifyCodeForm(true);
        } catch (e) {
            console.log('Lỗi xác thực số điện thoại:', e);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendPhoneNumber)}>
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Vui lòng nhập số điện thoại"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <div className="flex justify-center">
                <div id="recaptcha-container"></div>
            </div>
        </>
    );
}

function OTPInput({ verificationId }: { verificationId: string }) {
    const form = useForm<z.infer<typeof otpFormSchema>>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            otp: '',
        },
    });

    async function handleSendOpt(values: z.infer<typeof otpFormSchema>) {
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                values.otp,
            );
            const userCredential = await signInWithCredential(
                getAuth(),
                credential,
            );
            if (userCredential && userCredential.user) {
               const idToken = await userCredential.user.getIdToken();
                console.log('idToken:', idToken);
            }
        } catch (e) {
            console.error('Lỗi xác thực OTP:', e);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendOpt)}>
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </>
    );
}
