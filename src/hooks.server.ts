import { pb, type User } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';

if (pb.authStore.isValid) {
    try {
        await pb.collection('users').authRefresh();
    } catch (_) {
        pb.authStore.clear();
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    // before
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    if (pb.authStore.isValid) {
        try {
            await pb.collection('users').authRefresh();
        } catch (_) {
            pb.authStore.clear();
        }
    }

    event.locals.pb = pb;
    event.locals.user = structuredClone(pb.authStore.model) as unknown as User;

    const response = await resolve(event);

    // after
    response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax' }));

    return response;
};
