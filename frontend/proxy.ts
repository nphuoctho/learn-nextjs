import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const privatePaths = ['/me'];
const publicPaths = ['/login', '/register'];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token');

  if (privatePaths.includes(pathname) && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (publicPaths.includes(pathname) && sessionToken) {
    return NextResponse.redirect(new URL('/me', request.url));
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/register', '/me'],
};
