// Import types, libraries
import type { User } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

// Run on layout load, doesn't run every navigation
export const load = async (event: { locals: { user: User } }) => {
    // If user is authenticated
    if (event.locals.user) {
        // Redirect to auth state checker
        throw redirect(302, '/redirect');
    }
};
