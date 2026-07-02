import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_for_development_only_please_change'
);

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Check if it's an admin route (e.g. /en/admin, /bn/admin/dashboard, etc)
  const isAdminRoute = /^\/(bn|en|hi|de|es)\/admin/.test(pathname);

  if (isAdminRoute && !pathname.endsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value;
    
    if (!token) {
      // Redirect to login page
      const loginUrl = new URL(pathname.replace(/\/admin.*$/, '/admin/login'), req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token
      await jwtVerify(token, JWT_SECRET);
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL(pathname.replace(/\/admin.*$/, '/admin/login'), req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Pass through to next-intl middleware
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(bn|en|hi|de|es)/:path*']
};
