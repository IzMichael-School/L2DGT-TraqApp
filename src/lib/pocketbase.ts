// Import libraries
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import dayjs from 'dayjs';

// Establish connection with the database
export const pb = new PocketBase('https://db.traq.izmichael.com');

// Disable autocancellation for duplicated queries, to prevent false positives
pb.autoCancellation(false);

// Declare stores for current user, selected workspace, and save status
export const currentUser = writable<User>(pb.authStore.model as unknown as User);
export const workspace = writable<Workspace>();
export const saving = writable<false | 'working' | 'failed'>(false);

// Runs on app load, selects a workspace and subscribes to changes in the current user's record
async function init() {
    if (pb.authStore.model?.id) {
        pb.collection('users').subscribe(pb.authStore.model.id, (e) => {
            currentUser.set(e.record as unknown as User);
        });

        const workspaces = await pb.collection('workspaces').getFullList<Workspace>();
        workspace.set(workspaces[0]);
    }
}
init();

// Subscribe to changes in the selected workspace, update the $workspaces store with said changes
workspace.subscribe(async (val) => {
    if (!val?.id) return;
    saving.set('working');
    try {
        await pb.collection('workspaces').update(val.id, val);
        saving.set(false);
    } catch (error) {
        saving.set('failed');
    }
});

// Database types

// SQL Field Types
export type IsoDateString = string;
export type RecordIdString = string;

// Database metadata fields
export type BaseSystemFields<T = never> = {
    id: RecordIdString;
    created: IsoDateString;
    updated: IsoDateString;
    collectionId: string;
    collectionName: 'workspaces' | 'users';
    expand?: T;
};

// Database user metadata fields
export type AuthSystemFields<T = never> = {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

// Type declaration for a workspace record
export type WorkspacesRecord = {
    owner: RecordIdString;
    name: string;
    tasks: Task[];
    habits: Habit[];
    habitlogs: {
        [key: string]: {
            [key: string]: 0 | 1;
        };
    };
    tasklists: Tasklist[];
};

// Type declaration for a user record
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

// Tasks and Habits, basic item data
export type Trackable = {
    id: RecordIdString;
    name: string;
    notes: string;
};

// Types for a task item
export type Task = Trackable & {
    parent?: RecordIdString;
    duedate: IsoDateString;
    list: RecordIdString;
    progress: 0 | 0.5 | 1;
};

// Types for a habit item
export type Habit = Trackable & {
    frequency: {
        start: IsoDateString;
        days: number[];
        string: string;
    };
};

// Type for the tasklist object
export type Tasklist = {
    id: RecordIdString;
    name: string;
};

// Object Templates

export const templates: {
    task: Task;
    habit: Habit;
    tasklist: Tasklist;
} = {
    task: {
        id: genId(15),
        list: '',
        name: '',
        notes: '',
        parent: '',
        duedate: dayjs().toISOString(),
        progress: 0,
    },
    habit: {
        id: genId(15),
        name: '',
        notes: '',
        frequency: {
            start: dayjs().format('YYYY-MM-DD'),
            days: [0, 1, 2, 3, 4, 5, 6],
            string: 'Once a Day, 7 Days a Week',
        },
    },
    tasklist: {
        id: genId(15),
        name: '',
    },
};

// Helper function to generate a blank task
export function newTask(override?: object) {
    const task = { ...templates.task };
    task.id = genId(15);
    return {
        ...task,
        ...override,
    };
}

// Helper function to generate a blank task list
export function newTasklist(override?: object) {
    const tasklist = { ...templates.tasklist };
    tasklist.id = genId(15);
    return {
        ...tasklist,
        ...override,
    };
}

// Helper function to generate a blank habit
export function newHabit(override?: object) {
    const habit = { ...templates.habit };
    habit.id = genId(15);
    return {
        ...habit,
        ...override,
    };
}

// Generates a Database schema compliant ID string
function genId(length = 15) {
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
