import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('https://db.traq.izmichael.com');
pb.autoCancellation(false);

export const currentUser = writable<User>(pb.authStore.model as unknown as User);
export const workspace = writable<Workspace>();
export const saving = writable<boolean>(false);

if (pb.authStore.model?.id) {
    pb.collection('users').subscribe(pb.authStore.model.id, (e) => {
        currentUser.set(e.record as unknown as User);
    });

    const workspaces = await pb.collection('workspaces').getFullList<Workspace>();
    workspace.set(workspaces[0]);
}

workspace.subscribe(async (val) => {
    saving.set(true);
    if (!val?.id) return;
    await pb.collection('workspaces').update(val.id, val);
    saving.set(false);
    // const workspaces = await pb.collection('workspaces').getFullList<Workspace>();
    // const chosen = workspaces.find((a) => a.id == val.id);
    // if (chosen?.id) workspace.set(chosen);
});

saving.subscribe((val) => console.log(val ? 'Saving' : 'Saved'));

// SQL Field Types

export type IsoDateString = string;
export type RecordIdString = string;

// System fields

export type BaseSystemFields<T = never> = {
    id: RecordIdString;
    created: IsoDateString;
    updated: IsoDateString;
    collectionId: string;
    collectionName: 'workspaces' | 'users';
    expand?: T;
};

export type AuthSystemFields<T = never> = {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type WorkspacesRecord = {
    owner: RecordIdString;
    name: string;
    tasks: Task[];
    habits: Habit[];
    tags: Tag[];
    tasklists: TaskList[];
};

export type UsersRecord = {
    avatar?: string;
    preferences: {
        dateFormat: string;
    };
};

// Response types include system fields and match responses from the PocketBase API

export type Workspace<Texpand = unknown> = Required<WorkspacesRecord> & BaseSystemFields<Texpand>;
export type User<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
    workspaces: WorkspacesRecord;
    users: UsersRecord;
};

export type CollectionResponses = {
    workspaces: Workspace;
    users: User;
};

// Item Types

export type Trackable = {
    id: RecordIdString;
    name: string;
    progress: 0 | 0.5 | 1;
    notes: string;
    tags: RecordIdString[];
};

export type Task = Trackable & {
    parent?: RecordIdString;
    duedate: IsoDateString;
    list: RecordIdString;
};

export type Habit = Trackable & {
    frequency: {
        start: IsoDateString;
        days: number;
    };
};

export type Tag = {
    id: RecordIdString;
    name: string;
    color: string;
};

export type TaskList = {
    id: RecordIdString;
    name: string;
};

// Object Templates

export const templates: {
    task: Task;
} = {
    task: {
        id: genId(15),
        list: '',
        name: '',
        notes: '',
        parent: '',
        duedate: '',
        progress: 0,
        tags: [],
    },
};

export function newTask(override?: object) {
    const task = templates.task;
    task.id = genId(15);
    return {
        ...task,
        ...override,
    };
}

// Helper Functions
function genId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
