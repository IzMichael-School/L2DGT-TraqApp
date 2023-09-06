// Import libraries, types, stores
import { pb, type User } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';

// If saved login and is valid
if (pb.authStore.isValid) {
    try {
        // Refresh auth token
        await pb.collection('users').authRefresh();
    } catch (_) {
        // If failed, clear the saved login
        pb.authStore.clear();
    }
}

// Process with every request
export const handle: Handle = async ({ event, resolve }) => {
    // Refore Request
    // Load saved login to store
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    // If saved login and is valid
    if (pb.authStore.isValid) {
        try {
            // Refresh auth token
            await pb.collection('users').authRefresh();
        } catch (_) {
            // If failed, clear the saved login
            pb.authStore.clear();
        }
    }

    // Set the local variable to the database hook and saved login
    event.locals.pb = pb;
    event.locals.user = structuredClone(pb.authStore.model) as unknown as User;

    // Run the actual request
    const response = await resolve(event);

    // After Request
    // Save the current login
    response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax' }));

    // End handler
    return response;
};
