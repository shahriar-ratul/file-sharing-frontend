/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { auth } from 'auth';
import { type Session } from 'next-auth';
import { type NextRequest } from 'next/server';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, matchesRoute, publicRoutes } from './routes';
// export const middleware = auth;

export default auth((req: NextRequest & { auth: Session | null }): any => {
    const isLoggedIn = !!req.auth;

    const { nextUrl } = req;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (matchesRoute(nextUrl.pathname, publicRoutes)) {
        return null;
    }

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute && !isLoggedIn) {
        return null;
    }

    if (!isLoggedIn && !isPublicRoute && !isApiAuthRoute && !isAuthRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
    }

    return null;
});

export const config = { matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)'] };
