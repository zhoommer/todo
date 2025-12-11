import prisma from '$lib/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const completedParam = url.searchParams.get('status');

	const tasks = await prisma.task.findMany({
		take: 5,
		where: {
			completed:
				completedParam === 'COMPLETED' ? true : completedParam === 'WAITING' ? false : undefined
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		tasks
	};
};

export const actions: Actions = {
	createTask: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			await prisma.task.create({
				data: formData
			});
		} catch (error) {
			console.error('Error creating task:', error);
			return fail(500, { error: 'Failed to create task' });
		}

		return {
			status: 201
		};
	},
	deleteTask: async ({ url }) => {
		const id = url.searchParams.get('id');

		if (!id) return fail(400, { error: 'Task ID is required' });

		try {
			await prisma.task.delete({
				where: { id: id }
			});
		} catch (error) {
			console.error('Error deleting task:', error);
			fail(500, { error: 'Something went wrong deleting task' });
		}

		return {
			status: 200
		};
	},
	toggleTaskStatus: async ({ url }) => {
		const id = url.searchParams.get('id');

		if (!id) return fail(400, { error: 'Task ID is required' });

		try {
			const task = await prisma.task.update({
				where: { id: id },
				data: { completed: true }
			});

			return {
				status: 200,
				data: task
			};
		} catch (error) {
			console.error('Error completing task:', error);
			fail(500, { error: 'Something went wrong completing task' });
		}
	}
};
