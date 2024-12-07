'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
                    <h1 className="text-4xl font-bold mb-4">
                        Oops! Đã có lỗi xảy ra
                    </h1>
                    <h2 className="text-2xl mb-8"></h2>
                    <p className="text-lg mb-8 text-center max-w-md text-muted-foreground">
                        Có vẻ như đã xảy ra lỗi khi tải trang. Vui lòng thử lại
                        sau.
                    </p>
                    <Link href="/public">
                        <Button
                            className="flex items-center"
                            onClick={() => reset()}
                        >
                            <RotateCcw className="mr-1 h-4 w-4" />
                            Thử lại
                        </Button>
                    </Link>
                </div>
            </body>
        </html>
    );
}
