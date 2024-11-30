import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths: string[] = ['/', '/login', '/register', '/forgot-password', '/forgot-password/email'];
const customerStaticPaths: string[] = ['/order', '/cart', '/order/history'];
const adminStaticPaths: string[] = [
    '/dashboard',
    '/salary',
    '/payroll',
    '/admin/orders',
    '/categories',
    '/products',
    '/products/create',
    '/ingredients',
    '/ingredients/create',
    '/prices',
    '/prices/create',
    '/suppliers',
    '/employees/create',
    '/employees/update',
    '/income',
    '/expenditures',
    '/import',
    '/import/create',
    '/import/createFromProduction',
    '/export',
    '/export/create',
    '/inventory',
    '/inventory/createIngredients',
    '/inventory/createProducts',
    '/production',
    '/production/create',
    '/production/update',
    '/admin/orders',
    '/user-activity',
];
const adminDynamicPaths: string[] = [
    '/admin/orders',
    '/products',
    '/batches',
    '/customers',
    '/employees',
    '/production',
    '/contracts/create/',
    '/document',
    '/ingredients/update/',
    '/products/update/',
    '/ingredients/',
    '/inventory/'
];
const customerDynamicPaths: string[] = ['/order/detail'];
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

const isPublicPath = (path: string) => publicPaths.includes(path);
const isHasCustomerAndAdminPermission = (path: string, role: string) => {
    if (
        customerStaticPaths.includes(path) ||
        handleDynamicPath(path, customerDynamicPaths)
    ) {
        return role === 'ROLE_CUSTOMER' || role === 'ROLE_ADMIN';
    }
    return false;
};
const isHasAdminPermission = (path: string, role: string) => {
    if (
        adminStaticPaths.includes(path) ||
        handleDynamicPath(path, adminDynamicPaths)
    ) {
        return role === 'ROLE_ADMIN';
    }
    return false;
};
const handleDynamicPath = (path: string, dynamicPaths: string[]) => {
    for (const dynamicPath of dynamicPaths) {
        if (path.startsWith(dynamicPath)) {
            return true;
        }
    }
    return false;
};

export async function middleware(request: NextRequest) {
    const path: string = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value;

    if (isPublicPath(path)) {
        return NextResponse.next();
    }

    if (!token) {
        const loginUrl = new URL('/', request.nextUrl);
        loginUrl.searchParams.set('message', 'Không tìm thấy trang này');
        return NextResponse.redirect(loginUrl);
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
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    const loginUrl = new URL('/', request.nextUrl);
    loginUrl.searchParams.set('message', 'Không tìm thấy trang này');
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
