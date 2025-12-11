<script lang="ts">
	import Alert from '../components/alert/alert.svelte';
	import { confirm } from '../stores/alert.ts';

	let task: {
		title: string;
		category: 'WORK' | 'PERSONAL' | 'URGENT';
		completed: boolean;
		dueDate: string;
		notes: string;
	} = $state({
		title: '',
		category: 'WORK',
		completed: false,
		dueDate: '',
		notes: ''
	});

	function isExpired(dueDate: string): boolean {
		const today = new Date();
		const due = new Date(dueDate);
		return due < today;
	}

	let { data } = $props();

	async function handleDeleteTask(event: SubmitEvent, task: string) {
		event.preventDefault();

		const ok = await confirm(`${task} will delete!`, 'Are you sure want to delete?');

		if (!ok) return;

		const form = event.target as HTMLFormElement;

		form.submit();
	}

	async function handleToggleTaskStatus(event: Event) {
		event.preventDefault();

		const ok = await confirm(
			'The task status will change.',
			'Are you sure you want to change the task status?'
		);

		if (!ok) return;

		const form = (event.target as HTMLInputElement).form;

		form?.submit();
	}
</script>

<div class="container">
	<Alert />
	<aside>
		<div class="welcome">
			<div class="avatar"></div>
			<div class="welcome-content">
				<h3>Welcome!</h3>
				<p class="text-secondary">You have 4 tasks today.</p>
			</div>
		</div>

		<div class="form-container">
			<h1>New Task</h1>
			<p class="text-secondary">Plan your day.</p>

			<form method="POST" action="?/createTask">
				<div class="form-control">
					<label for="title">Title</label>
					<input
						bind:value={task.title}
						type="text"
						id="title"
						name="title"
						placeholder="Task title"
						required
					/>
				</div>

				<div class="form-control">
					<label for="category">Category</label>
					<div class="categories">
						<div class="radio-btn">
							<input
								id="work"
								type="radio"
								name="category"
								value="WORK"
								class="category-btn"
								class:work={task.category === 'WORK'}
								bind:group={task.category}
							/>
							<label for="work" class="text-secondary category-label">Work</label>
						</div>
						<div class="radio-btn">
							<input
								id="personal"
								type="radio"
								name="category"
								value="PERSONAL"
								class="category-btn"
								class:personal={task.category === 'PERSONAL'}
								bind:group={task.category}
							/>
							<label for="personal" class="text-secondary category-label">Personal</label>
						</div>
						<div class="radio-btn">
							<input
								id="urgent"
								type="radio"
								name="category"
								value="URGENT"
								class="category-btn"
								class:urgent={task.category === 'URGENT'}
								bind:group={task.category}
							/>
							<label for="urgent" class="text-secondary category-label">Urgent</label>
						</div>
					</div>
				</div>

				<div class="form-control">
					<label for="dueDate">Due Date</label>
					<input bind:value={task.dueDate} type="date" id="dueDate" name="dueDate" required />
				</div>

				<div class="form-control">
					<label for="notes">Notes</label>
					<textarea
						bind:value={task.notes}
						id="notes"
						name="notes"
						placeholder="Additional details"
						required
					></textarea>
				</div>

				<button class="create-task-btn" type="submit">Create Task</button>
			</form>
		</div>
	</aside>

	<main>
		<header>
			<div class="header-title">
				<h3>My tasks</h3>
				<p class="text-secondary">2 waiting task</p>
			</div>

			<div class="filter-group">
				<a href="?status=ALL">All</a>
				<a href="?status=WAITING">Waiting</a>
				<a href="?status=COMPLETED">Completed</a>
			</div>
		</header>

		<section>
			<ul class="todo-list">
				{#each data.tasks as task}
					<li
						class="todo-item"
						style:text-decoration={task.completed ? 'line-through' : 'none'}
						style:opacity={task.completed ? '0.6' : '1'}
					>
						<div class="checkbox-container">
							<form method="POST" action="?/toggleTaskStatus&id={task.id}">
								<input
									id="completed"
									name="completed"
									type="checkbox"
									checked={task.completed}
									disabled={task.completed}
									onchange={(event) => handleToggleTaskStatus(event)}
								/>
							</form>
						</div>

						<div class="todo-content">
							<div class="todo-details">
								<h4 class="todo-title">{task.title}</h4>
								<p class="todo-notes">{task.notes}</p>

								<div class="todo-dueDate-container">
									<datetime class="todo-dueDate">{task.dueDate}</datetime>
									<span class="todo-isExpired"> {isExpired(task.dueDate) ? 'Expired' : ''} </span>
								</div>
							</div>

							<div class="todo-actions">
								<button
									class={task.category === 'WORK'
										? 'work todo-category'
										: task.category === 'PERSONAL'
											? 'personal todo-category'
											: 'urgent todo-category'}>{task.category}</button
								>
								<form
									method="POST"
									action="?/deleteTask&id={task.id}"
									onsubmit={async (event: SubmitEvent) => handleDeleteTask(event, task.title)}
								>
									<button class="delete-btn" aria-label="Delete Task" type="submit">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											class="bi bi-trash2-fill"
											viewBox="0 0 16 16"
										>
											<path
												d="M2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"
											/>
										</svg>
									</button>
								</form>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');

	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	:root {
		--color-border: oklch(89.6% 0.013 251.659);
		--color-background: oklch(96.8% 0.007 247.896);
		--color-primary-text: oklch(12.9% 0.042 264.695);
		--color-secondary-text: oklch(55.4% 0.046 257.417);
		--color-surface: #fff;
		--color-button: oklch(51.1% 0.262 276.966);
		--color-button-hover: oklch(45.7% 0.24 277.023);
		--color-red-50: oklch(96.9% 0.015 12.422);
		--color-red-600: oklch(64.5% 0.246 16.439);
		--color-blue-50: oklch(97% 0.014 254.604);
		--color-blue-600: oklch(62.3% 0.214 259.815);
		--color-green-50: oklch(97.9% 0.021 166.113);
		--color-green-600: oklch(69.6% 0.17 162.48);

		--border-radius: 8px;
		--box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(body) {
		background-color: var(--color-background);
		color: var(--color-primary-text);
		font-family: 'Lato', sans-serif;
	}

	.container {
		display: flex;
		gap: 24px;
		height: 100vh;
		overflow: hidden;
	}

	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	header {
		position: fixed;
		width: calc(100% - 340px);
		display: flex;
		justify-content: space-between;
		background-color: var(--color-surface);
		padding: 16px;
		border-radius: var(--border-radius);
		height: 81px;
		box-shadow: var(--box-shadow);
	}

	.filter-group {
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: 16px;
		align-self: center;
	}

	.filter-group a {
		background-color: var(--color-surface);
		border: none;
		padding: 8px 16px;
		border-radius: var(--border-radius);
		color: var(--color-secondary-text);
		transition: background-color 0.3s ease;
		text-decoration: none;
	}

	.filter-group :global(a:nth-child(1)) {
		background-color: var(--color-background);
		font-weight: 600;
	}

	.filter-group a:focus {
		outline: none;
		box-shadow: 0 0 0 1px var(--color-button);
	}

	.filter-group a:hover {
		background-color: var(--color-background);
	}

	aside {
		width: 300px;
		min-width: 300px;
		height: 100vh;
	}

	section {
		margin-top: 81px;
		overflow-y: scroll;
	}

	label {
		color: var(--color-secondary-text);
		font-weight: 500;
	}

	.text-secondary {
		color: var(--color-secondary-text);
	}

	.welcome {
		position: fixed;
		width: 300px;
		display: flex;
		align-items: center;
		gap: 16px;
		background-color: var(--color-surface);
		padding: 16px;
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
	}

	.avatar {
		background-color: oklch(93% 0.034 272.788);
		color: var(--color-button);
		font-weight: 700;
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.avatar:after {
		content: 'AFG';
		display: block;
		width: 100%;
		height: 100%;
		line-height: 50px;
		text-align: center;
	}

	.welcome-content p {
		font-size: 14px;
	}

	.form-container {
		background-color: var(--color-surface);
		margin-top: 106px;
		border-radius: var(--border-radius);
		padding: 16px;
		box-shadow: var(--box-shadow);
		height: 100%;
	}

	form {
		margin-top: 16px;
	}

	.form-control {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
	}

	input,
	textarea {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		padding: 8px;
		border-radius: var(--border-radius);
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-button);
		box-shadow: 0 0 0 3px oklch(51.1% 0.262 276.966 / 0.3);
	}

	textarea {
		height: 80px;
		resize: none;
	}

	.create-task-btn {
		background-color: var(--color-button);
		color: #fff;
		border: none;
		padding: 12px;
		border-radius: var(--border-radius);
		width: 100%;
		font-size: 16px;
		font-weight: 600;
		transition: background-color 0.3s ease;
		cursor: pointer;
	}

	.create-task-btn:hover {
		background-color: var(--color-button-hover);
	}

	.categories {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}

	.radio-btn {
		position: relative;
	}

	.category-label {
		border: 1px solid var(--color-border);
		padding: 8px 12px;
		border-radius: var(--border-radius);
		cursor: pointer;
		transition: all 0.3 ease;
	}

	input[type='radio'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	#work:checked + .category-label {
		color: var(--color-blue-600);
		border-color: var(--color-blue-600);
		background-color: var(--color-blue-50);
	}

	#personal:checked + .category-label {
		color: var(--color-green-600);
		border-color: var(--color-green-600);
		background-color: var(--color-green-50);
	}

	#urgent:checked + .category-label {
		color: var(--color-red-600);
		border-color: var(--color-red-600);
		background-color: var(--color-red-50);
	}

	.work {
		color: var(--color-blue-600);
		border-color: var(--color-blue-600);
		background-color: var(--color-blue-50);
	}

	.personal {
		color: var(--color-green-600);
		border-color: var(--color-green-600);
		background-color: var(--color-green-50);
	}

	.urgent {
		color: var(--color-red-600);
		border-color: var(--color-red-600);
		background-color: var(--color-red-50);
	}

	li {
		display: flex;
		gap: 16px;
		border-radius: var(--border-radius);
		padding: 16px;
		margin-top: 26px;
		background-color: var(--color-surface);
		box-shadow: var(--box-shadow);
		position: relative;
	}

	li:hover .delete-btn {
		visibility: visible;
	}

	.todo-content {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
	}

	.todo-notes {
		color: var(--color-secondary-text);
	}

	.todo-dueDate-container {
		margin-top: 16px;
	}

	.todo-actions form {
		display: inline;
	}

	.todo-dueDate {
		border: 1px solid var(--color-border);
		background-color: var(--color-background);
		padding: 4px 8px;
		border-radius: var(--border-radius);
		font-size: 12px;
	}

	.todo-isExpired {
		color: var(--color-red-600);
		font-size: 12px;
		font-weight: 600;
		width: fit-content;
		margin-left: 8px;
	}

	.delete-btn {
		border: none;
		background: none;
		padding: 8px;
		transition:
			background-color 0.3s ease,
			color 0.3s ease,
			visibility 0.3s ease;
		border-radius: 50%;
		visibility: hidden;
	}

	.delete-btn:hover {
		background-color: var(--color-red-50);
		color: var(--color-red-600);
	}

	.todo-category {
		padding: 4px 8px;
		border-radius: var(--border-radius);
		border: none;
	}
</style>
