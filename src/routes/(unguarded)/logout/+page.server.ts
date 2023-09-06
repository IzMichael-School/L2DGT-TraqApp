// Import serverload types
import type { PageServerLoad } from './$types';

// Run on page load
export const load: PageServerLoad = async ({ cookies, locals }) => {
    // Delete the saved login
    cookies.delete('pb_auth');
    locals.pb.authStore.clear();
    locals.user = null;
    // Wait 5 seconds, to ensure it all clears successfully
    await sleep(5);
    return;
};

// Delay the execution by s number of seconds
function sleep(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
