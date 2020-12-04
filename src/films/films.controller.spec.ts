import { Test, TestingModule } from '@nestjs/testing'
import { FilmsController } from './films.controller'
import { FilmsService } from './films.service'
import { Film } from './film.model'
import * as faker from 'faker'

jest.mock('./films.service')

describe('FilmsController', () => {
    let controller: FilmsController
    let filmsService: FilmsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FilmsService],
            controllers: [FilmsController],
        }).compile()

        controller = module.get(FilmsController)
        filmsService = module.get(FilmsService)
    })

    describe('getting all films', () => {
        it('calls service getAll', async (done) => {
            const foundFilms: Film[] = [
                { id: faker.random.uuid(), title: faker.name.title() },
                { id: faker.random.uuid(), title: faker.name.title() },
            ]

            const getAllSpy = jest
                .spyOn(filmsService, 'getAll')
                .mockResolvedValue(foundFilms)

            const res = await controller.getAllFilms()

            expect(getAllSpy).toBeCalledTimes(1)
            expect(res).toEqual(foundFilms)
            done()
        })
    })
})
