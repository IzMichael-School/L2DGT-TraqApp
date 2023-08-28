import { redirect } from '@sveltejs/kit';

export async function load({ url, locals }) {
    if (!locals.user) {
        throw redirect(302, '/redirect');
    }
    return {
        currentPath: url?.pathname,
    };
}
