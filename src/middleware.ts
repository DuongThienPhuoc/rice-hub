import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths: string[] = ['/', '/login'];
const customerPaths: string[] = ['/order', '/cart', '/order/history'];
const adminPaths: string[] = ['/dashboard', 'salary', 'payroll'];
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
const isPublicPath = (path: string) => publicPaths.includes(path);
const isHasCustomerAndAdminPermission = (path: string, role: string) => {
    if (customerPaths.includes(path)) {
        return role === 'ROLE_CUSTOMER' || role === 'ROLE_ADMIN';
    }
    return false;
};
const isHasAdminPermission = (path: string, role: string) => {
    if(adminPaths.includes(path)){
        return role === 'ROLE_ADMIN'
    }
    return false;
}

export async function middleware(request: NextRequest) {
    const path: string = request.nextUrl.pathname;

    const token = request.cookies.get('token')?.value;

    if (isPublicPath(path)) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, secretKey);
        if (isHasCustomerAndAdminPermission(path, payload.role as string)) {
            return NextResponse.next();
        }
        if (isHasAdminPermission(path, payload.role as string)) {
            return NextResponse.next();
        }
    } catch (e) {
        console.error('Invalid token:', e);
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
