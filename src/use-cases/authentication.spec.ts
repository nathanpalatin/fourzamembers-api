import { hash } from 'bcrypt'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authentication'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			cpf: '999.999.999-99',
			phone: '+5547999999999',
			birthdate: '1993-06-14T00:00:00Z',
			password: await hash('123456', 1)
		})

		const { user } = await sut.execute({
			credential: 'johndoe@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() =>
			sut.execute({
				credential: 'johndoe@example.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong email', async () => {
		await usersRepository.create({
			name: 'John Doe',
			cpf: '999.999.999-99',
			phone: '+5547999999999',
			birthdate: '1993-06-14T00:00:00Z',
			email: 'johndoe@example.com',
			password: await hash('123456', 1)
		})

		await expect(() =>
			sut.execute({
				credential: 'johndoe@example.com',
				password: '123123'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
