import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import type { NotificationsRepository } from '../notifications-repository'

export class PrismaNotificationRepository implements NotificationsRepository {
	async findById(id: string) {
		const notification = await prisma.notifications.findUnique({
			where: {
				id
			}
		})
		return notification
	}

	async create(data: Prisma.NotificationsCreateInput) {
		const notification = await prisma.notifications.create({
			data
		})
		return notification
	}

	async delete(id: string) {
		const notification = await prisma.notifications.delete({
			where: {
				id
			}
		})
		return notification
	}
}