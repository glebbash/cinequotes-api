import { Test, TestingModule } from '@nestjs/testing'
import { Quote } from './models/quote.model'
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
        it('calls service with correct params', async () => {
            const language = 'en'
            const filmId = faker.random.uuid()
            const mockQuotes: Quote[] = []

            const byFilmSpy = jest
                .spyOn(service, 'getByFilm')
                .mockResolvedValue(mockQuotes)

            const quotes = await controller.getAllQuotesForFilm(
                filmId,
                language,
            )

            expect(byFilmSpy).toBeCalledWith(filmId, language)
            expect(quotes).toEqual(mockQuotes)
        })
    })

    describe('creating new quote', () => {
        it('calls service with correct params', async () => {
            const filmId = faker.random.uuid()
            const quote: Quote = {
                film: faker.name.title(),
                actor: faker.name.findName(),
                quote: faker.lorem.text(5),
            }

            const createSpy = jest
                .spyOn(service, 'create')
                .mockResolvedValue(filmId)

            const response = await controller.createNewQuote(quote)

            expect(createSpy).toBeCalledWith(quote)
            expect(response).toEqual({ filmId })
        })
    })
})
