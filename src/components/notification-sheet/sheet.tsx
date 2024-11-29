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
import { Bell, PackagePlus } from 'lucide-react';
import { IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notification';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NotificationSheetProviderProps {
    children: React.ReactNode;
}

interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    type?: 'CATEGORY' | 'ORDER';
    isRead?: boolean;
}

export default function NotificationSheetProvider({
    children,
}: NotificationSheetProviderProps) {
    const stompClient = Stomp.over(
        () => new SockJS('http://localhost:8080/ws'),
    );
    const [notifications, setNotifications] = React.useState<Notification[]>(
        [],
    );
    const { setHasNewNotification } = useNotificationStore();
    const [refresh, setRefresh] = React.useState(false);
    const { toast } = useToast();

    function setNotificationToLocalStorage(newNotification: Notification) {
        const getNotificationsFromLocalStorage =
            typeof window !== 'undefined' &&
            localStorage.getItem('notifications');
        const prevNotifications = getNotificationsFromLocalStorage
            ? JSON.parse(getNotificationsFromLocalStorage)
            : [];
        localStorage.setItem(
            'notifications',
            JSON.stringify([...prevNotifications, newNotification]),
        );
    }

    function handleNewNotification(
        message: IMessage,
        type: 'CATEGORY' | 'ORDER',
    ) {
        setHasNewNotification(true);
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
                id: new Date().getTime().toString(),
                message: message.body,
                timestamp: new Date(),
                type: type,
                isRead: false,
            },
        ]);
        toast({
            variant: 'success',
            title: 'Thông báo mới',
            description: message.body,
            duration: 5000,
        });
        setNotificationToLocalStorage({
            id: new Date().getTime().toString(),
            message: message.body,
            timestamp: new Date(),
            type: type,
            isRead: false,
        });
    }

    useEffect(() => {
        stompClient.connect(
            {},
            () => {
                stompClient.subscribe('/topic/categories', (message) => {
                    handleNewNotification(message, 'CATEGORY');
                });
                stompClient.subscribe('/topic/orders', (message) => {
                    handleNewNotification(message, 'ORDER');
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
        const getNotificationsFromLocalStorage =
            typeof window !== 'undefined' &&
            localStorage.getItem('notifications');
        if (getNotificationsFromLocalStorage) {
            const localStorageLength = JSON.parse(
                getNotificationsFromLocalStorage,
            ).length;
            if (localStorageLength > 10) {
                localStorage.setItem('notifications', JSON.stringify([]));
            }
        }
        setNotifications(
            getNotificationsFromLocalStorage
                ? JSON.parse(getNotificationsFromLocalStorage)
                : [],
        );
    }, [refresh]);

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="bg-white">
                <SheetHeader>
                    <SheetTitle>Thông báo</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="h-full">
                    <div className="w-full flex justify-end">
                        <span
                            className={cn(
                                'bg-primary/10 py-1 px-2 rounded-md text-sm hover:cursor-pointer',
                                notifications.length === 0 && 'hidden',
                            )}
                            onClick={() => {
                                setNotifications([]);
                                localStorage.setItem(
                                    'notifications',
                                    JSON.stringify([]),
                                );
                                setRefresh(!refresh);
                            }}
                        >
                            Xoá tất cả
                        </span>
                    </div>
                    {notifications.length > 0 ? (
                        <div className="mt-5">
                            <NotificationCard
                                notifications={notifications}
                                refresh={refresh}
                                setRefresh={setRefresh}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-muted-foreground">
                                Không có thông báo nào
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NotificationCard({
    notifications,
    refresh,
    setRefresh,
}: {
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    notifications: Notification[];
}) {
    const router = useRouter();
    const iconMapping: Record<string, React.ReactElement> = {
        CATEGORY: <Bell className="h-4 w-4" />,
        ORDER: <PackagePlus className="h-4 w-4" />,
    };

    function handleReadNotification(id: string) {
        const updatedNotifications = notifications.map(
            (notification: Notification) => {
                if (notification.id === id) {
                    return {
                        ...notification,
                        isRead: true,
                    };
                }
                return notification;
            },
        );
        localStorage.setItem(
            'notifications',
            JSON.stringify(updatedNotifications),
        );
        setRefresh(!refresh);
    }

    return (
        <ul className="space-y-4">
            {notifications
                .slice()
                .reverse()
                .map((notification, _index) => (
                    <li
                        key={_index}
                        className={cn(
                            'flex items-start space-x-4 p-4 rounded-md',
                            !notification.isRead && 'bg-[#d1d5db]',
                        )}
                        onClick={() => {
                            if (notification.type !== 'ORDER') {
                                console.log('Clicked');
                                handleReadNotification(notification.id);
                            } else {
                                console.log('Clicked another');
                                handleReadNotification(notification.id);
                                router.push(
                                    `/admin/orders/${notification.message.split(' ')[2]}`,
                                );
                            }
                        }}
                    >
                        <div className="bg-primary/10 rounded-full p-2">
                            {
                                iconMapping[
                                    notification.type ? notification.type : ''
                                ]
                            }
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
