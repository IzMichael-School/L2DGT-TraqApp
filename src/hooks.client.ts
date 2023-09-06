// Import libraries, types, stores
import { currentUser, pb, type User } from '$lib/pocketbase';

// Load saved login from cookie
pb.authStore.loadFromCookie(document.cookie);

// When active auth changed
pb.authStore.onChange(() => {
    // Set the store to current auth
    currentUser.set(pb.authStore.model as unknown as User);

    // Save the current auth
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax' });
});
