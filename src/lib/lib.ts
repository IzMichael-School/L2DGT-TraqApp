export function isEmail(str: string) {
    const regex =
        // eslint-disable-next-line no-control-regex
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(str);
}

export function generatePassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

import { writable } from 'svelte/store';
// State indicator for when any popups are visible
export const poppedup = writable(false);

// UI Colouring
export const color = writable<Color>('paleblue');
export const colors: Colors = {
    blue: '#4577CA',
    paleblue: '#84AECD',
    red: '#814B5E',
    green: '#136577',
    lavender: '#DBE3F5',
    lightgrey: '#878C9C',
    grey: '#363844',
};

export type Color = 'blue' | 'paleblue' | 'red' | 'green' | 'lavender' | 'lightgrey' | 'grey';
export type Colors = {
    [key in Color]: string;
};

export const multiSorter = (fields: string[]) => (a: object, b: object) =>
    fields
        .map((o) => {
            let dir = 1;
            if (o[0] === '-') {
                dir = -1;
                o = o.substring(1);
            }
            return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
        })
        .reduce((p, n) => (p ? p : n), 0);
