import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) as {
            username: string;
            password: string;
        };

        // Validation
        if (!(data.username.length > 0))
            return fail(400, { error: 'Check your username/email input. It may be blank.' });
        if (!(data.password.length > 0)) return fail(400, { error: 'Check your password input. It may be blank.' });

        try {
            await locals.pb.collection('users').authWithPassword(data.username, data.password);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            console.error(e);

            if (e?.response.code == 400 && e?.response.message == 'Failed to authenticate.')
                return fail(400, { error: 'Incorrect username or password.' });

            throw e;
        }

        throw redirect(303, '/redirect');
    },
};
