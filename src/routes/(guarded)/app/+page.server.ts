// Import redirect library
import { redirect } from '@sveltejs/kit';

// Run on page load
export async function load({ locals }) {
    // If no authenticated user
    if (!locals.user) {
        // Redirect to auth state checker
        throw redirect(302, '/redirect');
    }
    return {};
}
