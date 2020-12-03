import { Test, TestingModule } from '@nestjs/testing'
import { Quote } from './quote.model'
import { QuotesController } from './quotes.controller'
import { QuotesService } from './quotes.service'
import * as faker from 'faker'

jest.mock('./quotes.service')

describe('QuotesController', () => {
    let service: QuotesService
    let controller: QuotesController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuotesService],
            controllers: [QuotesController],
        }).compile()

        controller = module.get(QuotesController)
        service = module.get(QuotesService)
    })

    describe('getting quotes for film', () => {
        it('calls service with correct params', () => {
            const filmId = faker.random.uuid()
            const mockQuotes: Quote[] = []

            const byFilmSpy = jest
                .spyOn(service, 'byFilm')
                .mockResolvedValue(mockQuotes)

            const quotes = controller.getAllQuotesForFilm(filmId)

            expect(byFilmSpy).toBeCalledWith(filmId)
            expect(quotes).toEqual(mockQuotes)
        })
    })

    describe('creating new quote', () => {
        it('calls service with correct params', () => {
            expect(controller).toBeDefined()
        })
    })
})
