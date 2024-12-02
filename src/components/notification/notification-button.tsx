'use client'

import NotificationSheetProvider from '@/components/notification-sheet/sheet';
import { Bell } from 'lucide-react';
import React from 'react';
import { useNotificationStore } from '@/stores/notification';

export default function NotificationButton() {
    const { hasNewNotification, setHasNewNotification } = useNotificationStore();
    return (
        <NotificationSheetProvider>
            <div
                className="flex items-center justify-center"
                onClick={() => setHasNewNotification(false)}
            >
                <div className="relative">
                    <Bell className="h-5 w-5" />
                    {hasNewNotification && (
                        <div className="bg-red-500 absolute top-0 right-0 w-2 h-2 rounded-full "></div>
                    )}
                </div>
            </div>
        </NotificationSheetProvider>
    );
}
