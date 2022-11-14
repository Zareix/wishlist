import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const user = writable<User>(null);

export const dialogImage = writable(null);

export const snackbar = writable(null);
