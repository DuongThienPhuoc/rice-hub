'use client';

import NotificationSheetProvider from '@/components/notification-sheet/sheet';
import { Bell } from 'lucide-react';
import React from 'react';
import { useNotificationStore } from '@/stores/notification';
import { cn } from '@/lib/utils';

export default function NotificationButton({
    admin,
}: {
    admin?: boolean;
}) {
    const { hasNewNotification, setHasNewNotification } =
        useNotificationStore();
    return (
        <NotificationSheetProvider>
            <div
                className="flex items-center justify-center"
                onClick={() => setHasNewNotification(false)}
            >
                <div className="relative">
                    <Bell className={cn("h-5 w-5", admin && 'text-white')} />
                    {hasNewNotification && (
                        <div className="bg-red-500 absolute top-0 right-0 w-2 h-2 rounded-full "></div>
                    )}
                </div>
            </div>
        </NotificationSheetProvider>
    );
}
