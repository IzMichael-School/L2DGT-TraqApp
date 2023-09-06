// Import redirect library
import { redirect } from '@sveltejs/kit';

// Run on layout load, does not run on navigation when layout is not changed
export async function load({ url, locals }) {
    // If no authenticated user
    if (!locals.user) {
        // Redirect to auth state checker
        throw redirect(302, '/redirect');
    }
    // Pass current path as data to layout
    return {
        currentPath: url?.pathname,
    };
}
