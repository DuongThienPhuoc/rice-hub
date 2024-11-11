import { Skeleton } from '@/components/ui/skeleton';

export function UserCardContainerSkeleton() {
    return (
        <div className='p-2 pb-0 border rounded h-[320px] bg-white space-y-3'>
            <Skeleton className='h-[48px] w-[286px]'></Skeleton>
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
        </div>
    );
}

export function UserCardSkeleton() {
    return (
        <Skeleton className='w-[286px] h-[62px]'></Skeleton>
    );
}
