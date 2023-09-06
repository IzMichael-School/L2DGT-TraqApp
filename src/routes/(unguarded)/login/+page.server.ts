// Import types, libraries
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    // Run on request from page
    default: async ({ locals, request }) => {
        // Get data from request body, parse into JSON
        const data = Object.fromEntries(await request.formData()) as {
            username: string;
            password: string;
        };

        // Validation
        // Ensure username input is not empty
        if (!(data.username.length > 0))
            return fail(400, { error: 'Check your username/email input. It may be blank.' });
        // Ensure password input is not empty
        if (!(data.password.length > 0)) return fail(400, { error: 'Check your password input. It may be blank.' });

        try {
            // Log user in with specified credentials
            await locals.pb.collection('users').authWithPassword(data.username, data.password);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            // If error thrown during login process, return error message
            if (e?.response.code == 400 && e?.response.message == 'Failed to authenticate.')
                return fail(400, { error: 'Incorrect username or password.' });

            throw e;
        }

        // Redirect the newly authenticated user to the auth state checker redirect
        throw redirect(303, '/redirect');
    },
};
