// Import redirect function
import { redirect } from '@sveltejs/kit';

// Run on page load
export const load = async (event) => {
    // If user is authenticated
    if (event.locals.user) {
        // Redirect to app
        throw redirect(302, '/app');
    } else {
        // Redirect to home
        throw redirect(302, '/');
    }
};
