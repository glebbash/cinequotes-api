import { FirestoreService } from '@/firestore/firestore.service'
import { Test, TestingModule } from '@nestjs/testing'
import { FilmsService } from './films.service'
import * as faker from 'faker'
import { FS_FILMS_COL } from '@/common/constants'

describe('FilmsService', () => {
    const mockFirestore: any = {
        db: {
            collection: jest.fn(),
        },
    }
    const mockCollection: any = {
        select: jest.fn(),
        get: jest.fn(),
    }

    let service: FilmsService
    let firestore: FirestoreService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: FirestoreService, useValue: mockFirestore },
                FilmsService,
            ],
        }).compile()

        service = module.get(FilmsService)
        firestore = module.get(FirestoreService)
    })

    it('should select correct data', async () => {
        const filmsSnapshot = {
            docs: Array(5).fill(null).map(generateFilm),
        }
        const mockFoundFilms = filmsSnapshot.docs.map((film) => ({
            id: film.id,
            title: film.data().title,
        }))

        const collectionSpy = jest
            .spyOn(firestore.db, 'collection')
            .mockReturnValue(mockCollection)
        const selectSpy = jest.spyOn(mockCollection, 'select').mockReturnThis()
        jest.spyOn(mockCollection, 'get').mockResolvedValue(filmsSnapshot)

        const foundFilms = await service.getAll()

        expect(collectionSpy).toBeCalledWith(FS_FILMS_COL)
        expect(selectSpy).toBeCalledWith('title')
        expect(foundFilms).toEqual(mockFoundFilms)
    })
})

function generateFilm() {
    const data = { title: faker.name.title() }

    return {
        id: faker.random.uuid(),
        data: () => data,
    }
}
