import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    console.log(event.locals);
    if (event.locals.user) {
        throw redirect(302, '/app');
    } else {
        throw redirect(302, '/');
    }
};
