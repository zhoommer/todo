<script lang="ts">
	import { confirmState } from '../../stores/alert.ts';
	import type { ConfirmState } from '../../stores/alert.ts';

	let state: ConfirmState;

	$: (state, ($confirmState = state = $confirmState));

	function accept() {
		if (state.resolve) {
			state.resolve(true);
		}

		confirmState.update((s) => ({
			...s,
			visible: false,
			resolve: null
		}));
	}

	function cancel() {
		if (state.resolve) {
			state.resolve(false);
		}

		confirmState.update((s) => ({
			...s,
			visible: false,
			resolve: null
		}));
	}
</script>

<form>
	<dialog class="alert-dialog" open={$confirmState.visible}>
		<div class="alert-content">
			<h2 class="alert-title">{state.title}</h2>
			<p class="alert-message">{state.message}</p>
			<button class="alert-ok" onclick={accept}>OK</button>
			<button class="alert-close" onclick={cancel}>Close</button>
		</div>
	</dialog>
</form>

<style>
	.alert-dialog {
		position: absolute;
		backdrop-filter: blur(4px);
		padding: 1rem;
		z-index: 1000;
		top: 25%;
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
	}

	.alert-ok {
		border: none;
		background-color: var(--color-red-50);
		color: var(--color-red-600);
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
	}

	.alert-close {
		border: none;
		background-color: var(--color-green-50);
		color: var(--color-green-600);
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
		float: right;
	}
</style>
