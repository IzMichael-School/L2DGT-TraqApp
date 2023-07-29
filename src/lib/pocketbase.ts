import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('https://server.loqui.izmichael.com');
pb.autoCancellation(false);

export const currentUser = writable<User>(pb.authStore.model as unknown as User);

// currentUser.subscribe((e) => {
//     console.log(e);
// });

if (pb.authStore.model?.id) {
    pb.collection('users').subscribe(pb.authStore.model.id, (e) => {
        currentUser.set(e.record as unknown as User);
    });
}

// SQL Field Types

export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields

export type BaseSystemFields<T = never> = {
    id: RecordIdString;
    created: IsoDateString;
    updated: IsoDateString;
    collectionId: string;
    collectionName: 'channels' | 'messages' | 'users';
    expand?: T;
};

export type AuthSystemFields<T = never> = {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type ChannelsRecord = {
    type?: 'direct' | 'group';
    name?: string;
    creator?: RecordIdString;
    members?: RecordIdString[];
};

export type MessagesRecord = {
    content?: string;
    timestamp?: IsoDateString;
    author?: RecordIdString;
    channel?: RecordIdString;
    state?: 'sent' | 'delivered';
};

export type UsersRecord = {
    avatar?: string;
    nickname?: string;
    lastseen?: IsoDateString;
    activity?: 'auto' | 'dnd' | 'ghost';
    viewhistory: { [id: string]: IsoDateString };
    appscale: number;
    windowsize: string;
    windowresize: boolean;
    alwaysontop: boolean;
    addresses: string[];
};

// Response types include system fields and match responses from the PocketBase API

export type Channel<Texpand = unknown> = Required<ChannelsRecord> & BaseSystemFields<Texpand>;
export type Message<Texpand = unknown> = Required<MessagesRecord> & BaseSystemFields<Texpand>;
export type User<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
    channels: ChannelsRecord;
    messages: MessagesRecord;
    users: UsersRecord;
};

export type CollectionResponses = {
    channels: Channel;
    messages: Message;
    users: User;
};
