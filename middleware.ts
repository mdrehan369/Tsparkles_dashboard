import { NextResponse, NextRequest } from 'next/server';
import { verifyJwt } from './utils/auth';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    if (!token && request.nextUrl.pathname == '/auth/signin') return NextResponse.next();
    if (!token) return NextResponse.redirect(new URL('/auth/signin', request.url));

    const isTokenVerified = verifyJwt(token);
    if (!isTokenVerified) {
        request.cookies.delete('accessToken');
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (token && request.nextUrl.pathname == '/auth/signin')
        return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api).*)'],
    runtime: 'nodejs',
};
