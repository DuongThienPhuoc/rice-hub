'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import * as React from 'react';
import { Bell } from 'lucide-react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notification';

interface NotificationSheetProviderProps {
    children: React.ReactNode;
}

interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    type?: string;
}

export default function NotificationSheetProvider({
    children,
}: NotificationSheetProviderProps) {
    const stompClient = Stomp.over(
        () => new SockJS('http://localhost:8080/ws'),
    );
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const { setHasNewNotification } = useNotificationStore();

    useEffect(() => {
        stompClient.connect(
            {},
            (message: never) => {
                console.log('Connected to the server:', message);
                stompClient.subscribe('/topic/categories', (message) => {
                    console.log('Received message:', message.body);
                    setHasNewNotification(true);
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        {
                            id: new Date().getTime().toString(),
                            message: message.body,
                            timestamp: new Date(),
                        },
                    ]);
                });
            },
            (error: never) => {
                console.error(
                    'Error connecting to the WebSocket server:',
                    error,
                );
            },
        );
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('Disconnected from the server');
                });
            }
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'notifications',
            JSON.stringify(notifications),
        );
    }, [notifications]);

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="bg-white">
                <SheetHeader>
                    <SheetTitle>Thông báo</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="mt-5">
                    <NotificationCard notifications={notifications} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NotificationCard({
    notifications,
}: {
    notifications: Notification[];
}) {
    return (
        <ul className="space-y-4">
            {notifications.map((notification, _index) => (
                <li key={_index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                        <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            3 hours ago
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
