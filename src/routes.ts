/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/contact', '/share/files/:id'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ['/login'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';

/**
 * Checks if the current path matches any of the defined routes
 * Handles both static and dynamic routes
 * @param {string} path - The current path to check
 * @param {string[]} routes - Array of routes to match against
 * @returns {boolean}
 */
export const matchesRoute = (path: string, routes: string[]): boolean => {
    return routes.some((route) => {
        // Convert route pattern to regex
        const pattern = route
            .replace(/:[^/]+/g, '([^/]+)') // Convert :id to capture group
            .replace(/\//g, '\\/'); // Escape forward slashes

        const regex = new RegExp(`^${pattern}$`);
        return regex.test(path);
    });
};
