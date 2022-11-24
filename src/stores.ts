import type { DialogImage } from './models/DialogImage';
import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const user = writable<User>(null);

export const dialogImage = writable<DialogImage>(null);
