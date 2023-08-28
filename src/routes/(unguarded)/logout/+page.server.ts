import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
    console.log('logging out');
    cookies.delete('pb_auth');
    locals.pb.authStore.clear();
    locals.user = null;
    console.log('logged out');
    await sleep(5);
    return;
};

function sleep(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
