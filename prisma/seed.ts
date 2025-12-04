import { PrismaClient, Prisma } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({
	adapter
});

const taskData: Prisma.TaskCreateInput[] = [
	{
		title: 'Buy groceries',
		category: 'PERSONAL',
		dueDate: '2025-12-05',
		notes: 'Milk, eggs, bread, vegetables'
	},
	{
		title: 'Prepare project presentation',
		category: 'WORK',
		dueDate: '2025-12-07',
		notes: 'Finalize slides and rehearse'
	},
	{
		title: 'Book dentist appointment',
		category: 'PERSONAL',
		dueDate: '2025-12-10',
		notes: 'Call clinic in the morning'
	},
	{
		title: 'Pay electricity bill',
		category: 'PERSONAL',
		dueDate: '2025-12-03',
		notes: 'Use mobile banking app'
	},
	{
		title: 'Clean the house',
		category: 'PERSONAL',
		dueDate: '2025-12-08',
		notes: 'Living room, kitchen, bedroom'
	},
	{
		title: 'Write blog post',
		category: 'PERSONAL',
		dueDate: '2025-12-12',
		notes: 'Topic: Improving developer productivity'
	},
	{
		title: 'Refactor authentication module',
		category: 'WORK',
		dueDate: '2025-12-09',
		notes: 'Simplify middleware logic'
	},
	{
		title: 'Plan weekend trip',
		category: 'WORK',
		dueDate: '2025-12-06',
		notes: 'Decide location and make reservations'
	},
	{
		title: 'Read 50 pages of a book',
		category: 'PERSONAL',
		dueDate: '2025-12-04',
		notes: 'Continue reading current book'
	},
	{
		title: 'Organize workspace',
		category: 'PERSONAL',
		dueDate: '2025-12-11',
		notes: 'Sort cables, clean desk, rearrange shelves'
	}
];

export async function main() {
	for (const t of taskData) {
		await prisma.task.create({ data: t });
	}
}

main();
