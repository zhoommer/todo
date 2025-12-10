import { writable, type Writable } from 'svelte/store';

export interface ConfirmState {
	title: string;
	message: string;
	visible: boolean;
	resolve: ((value: boolean) => void) | null;
}

export const confirmState: Writable<ConfirmState> = writable({
	title: '',
	message: '',
	visible: false,
	resolve: null
});

export function confirm(title: string, message: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		confirmState.set({
			title,
			message,
			visible: true,
			resolve
		});
	});
}
