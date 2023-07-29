import { currentUser, pb, type User } from '$lib/pocketbase';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model as unknown as User);
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});
