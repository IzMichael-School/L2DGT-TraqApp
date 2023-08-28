import { isEmail } from '$lib/lib';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) as {
            username: string;
            email: string;
            password: string;
            passwordConfirm: string;
        };

        // Validation
        if (isEmail(data.username)) return fail(400, { error: 'Username cannot be an email address.' });
        if (!isEmail(data.email)) return fail(400, { error: 'Invalid email address. Check the formatting.' });
        if (!(data.password.length > 0 && data.passwordConfirm.length > 0))
            return fail(400, { error: 'Check your password inputs. One or more are blank.' });
        if (data.password != data.passwordConfirm) return fail(400, { error: 'Password inputs are not identical.' });
        if (data.password.includes(' ')) return fail(400, { error: 'Password cannot contain spaces.' });

        try {
            await locals.pb.collection('users').create({
                ...data,
            });
            await locals.pb.collection('users').requestVerification(data.email);
            const user = await locals.pb.collection('users').authWithPassword(data.email, data.password);
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
            console.error(e?.response.data);

            if (e?.response.data?.username) return fail(400, { error: e.response.data.username.message });
            if (e?.response.data?.email) return fail(400, { error: e.response.data.email.message });
            if (e?.response.data?.password) return fail(400, { error: e.response.data.password.message });

            throw e;
        }

        throw redirect(303, '/redirect');
    },
};
