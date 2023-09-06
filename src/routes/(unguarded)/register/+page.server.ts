// Import libraries, types, stores
import { isEmail } from '$lib/lib';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    // Run on request from page
    default: async ({ locals, request }) => {
        // Get data from request body, parse into JSON
        const data = Object.fromEntries(await request.formData()) as {
            username: string;
            email: string;
            password: string;
            passwordConfirm: string;
        };

        // Validation
        // Ensure username is not an email address
        if (isEmail(data.username)) return fail(400, { error: 'Username cannot be an email address.' });
        // Ensure email address is a valid email address
        if (!isEmail(data.email)) return fail(400, { error: 'Invalid email address. Check the formatting.' });
        // Ensure both password input have been filled
        if (!(data.password.length > 0 && data.passwordConfirm.length > 0))
            return fail(400, { error: 'Check your password inputs. One or more are blank.' });
        // Ensure password confirmation matches original input
        if (data.password != data.passwordConfirm) return fail(400, { error: 'Password inputs are not identical.' });
        // Ensure password does not contain spaces
        if (data.password.includes(' ')) return fail(400, { error: 'Password cannot contain spaces.' });

        try {
            // Create user with specified input data
            await locals.pb.collection('users').create({
                ...data,
            });
            // Send verification email
            await locals.pb.collection('users').requestVerification(data.email);
            // Log user in with specified credentials
            const user = await locals.pb.collection('users').authWithPassword(data.email, data.password);
            // Create the user a default workspace
            await locals.pb.collection('workspaces').create({
                owner: user.record.id,
                name: `${data.username}'s Workspace`,
                tasks: [],
                tasklists: [],
                habits: [],
                habitlogs: [],
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            // Return error messages based on failures in database functions
            if (e?.response.data?.username) return fail(400, { error: e.response.data.username.message });
            if (e?.response.data?.email) return fail(400, { error: e.response.data.email.message });
            if (e?.response.data?.password) return fail(400, { error: e.response.data.password.message });

            throw e;
        }

        // Redirect the newly authenticated user to the auth state checker redirect
        throw redirect(303, '/redirect');
    },
};
