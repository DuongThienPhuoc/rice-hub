import * as React from 'react';

export default function UserActivityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <section>
                <div className="container mx-auto">{children}</div>
            </section>
        </>
    );
}
