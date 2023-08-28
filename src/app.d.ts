import PocketBase from 'pocketbase';
import { type User } from '$lib/pocketbase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            pb: PocketBase;
            user: User | null;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
