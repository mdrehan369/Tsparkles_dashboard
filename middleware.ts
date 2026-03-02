import { NextResponse, NextRequest } from 'next/server';
import { verifyJwt } from './utils/auth';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    if (!token && request.nextUrl.pathname == '/auth/signin') return NextResponse.next();
    if (!token) return NextResponse.redirect(new URL('/auth/signin', request.url));

    const isTokenVerified = verifyJwt(token);
    if (!isTokenVerified) {
        const response = NextResponse.redirect(new URL('/auth/signin', request.url));
        response.cookies.delete('accessToken');
        return response;
    }

    if (token && request.nextUrl.pathname == '/auth/signin')
        return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api).*)'],
    runtime: 'nodejs',
};
