import { FirestoreService } from '@/firestore/firestore.service'
import { PubSubService } from '@/pub-sub/pub-sub.service'
import { Test, TestingModule } from '@nestjs/testing'
import { QuotesService } from './quotes.service'
import * as faker from 'faker'
import { FS_FILMS_COL, FS_QUOTES_COL } from '@/common/constants'
import { NotFoundException } from '@nestjs/common'
import { CreateQuote } from './models/create-quote.model'

jest.mock('@/pub-sub/pub-sub.service')

describe('QuotesService', () => {
    const mockQuoteDoc = {
        id: '',
    }
    const mockQuotesCol = {
        add: jest.fn().mockResolvedValue(mockQuoteDoc),
        get: jest.fn(),
    }
    const mockFilmDoc = {
        id: '',
        collection: jest.fn().mockReturnValue(mockQuotesCol),
    }
    const mockFilmsCol = {
        where: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnValue(mockFilmDoc),
        add: jest.fn().mockReturnValue(mockFilmDoc),
        get: jest.fn(),
    }
    const mockFirestore = {
        db: { collection: jest.fn().mockReturnValue(mockFilmsCol) },
    }

    let service: QuotesService
    let pubsub: PubSubService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PubSubService,
                { provide: FirestoreService, useValue: mockFirestore },
                QuotesService,
            ],
        }).compile()

        service = module.get(QuotesService)
        pubsub = module.get(PubSubService)
    })

    describe('getting quotes by film', () => {
        it('finds film and gets translated quotes', async () => {
            const filmId = faker.random.uuid()
            const language = 'fr'
            const quotesSnapshot = {
                empty: false,
                docs: [
                    {
                        data() {
                            return {
                                actor: 'a',
                                quote: { en: 'a-en', fr: 'a-fr' },
                            }
                        },
                    },
                    {
                        data() {
                            return {
                                actor: 'b',
                                quote: { en: 'b-en', fr: 'b-fr' },
                            }
                        },
                    },
                ],
            }
            const mockQuotes = [
                { actor: 'a', quote: 'a-fr' },
                { actor: 'b', quote: 'b-fr' },
            ]

            mockQuotesCol.get.mockResolvedValue(quotesSnapshot)

            const quotes = await service.getByFilm(filmId, language)

            expect(mockFirestore.db.collection).toHaveBeenCalledWith(
                FS_FILMS_COL,
            )
            expect(mockFilmsCol.doc).toBeCalledWith(filmId)
            expect(mockFilmDoc.collection).toHaveBeenCalledWith(FS_QUOTES_COL)
            expect(quotes).toEqual(mockQuotes)
        })

        it('finds film and falls back to eng quotes', async () => {
            const filmId = faker.random.uuid()
            const language = 'fr'
            const quotesSnapshot = {
                empty: false,
                docs: [
                    {
                        data() {
                            return {
                                actor: 'a',
                                quote: { en: 'a-en', fr: 'a-fr' },
                            }
                        },
                    },
                    {
                        data() {
                            return {
                                actor: 'b',
                                quote: { en: 'b-en', fr: 'b-fr' },
                            }
                        },
                    },
                ],
            }
            const mockQuotes = [
                { actor: 'a', quote: 'a-fr' },
                { actor: 'b', quote: 'b-fr' },
            ]

            mockQuotesCol.get.mockResolvedValue(quotesSnapshot)

            const quotes = await service.getByFilm(filmId, language)

            expect(mockFirestore.db.collection).toHaveBeenCalledWith(
                FS_FILMS_COL,
            )
            expect(mockFilmsCol.doc).toBeCalledWith(filmId)
            expect(mockFilmDoc.collection).toHaveBeenCalledWith(FS_QUOTES_COL)
            expect(quotes).toEqual(mockQuotes)
        })

        it('does not find film', async () => {
            const filmId = faker.random.uuid()
            const language = 'fr'
            const quotesSnapshot = {
                empty: true,
                docs: [],
            }

            mockQuotesCol.get.mockResolvedValue(quotesSnapshot)

            expect.assertions(1)
            try {
                await service.getByFilm(filmId, language)
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException)
            }
        })
    })

    describe('creating quote', () => {
        it('adds quote to existing film', async () => {
            const mockFilmId = faker.random.uuid()
            mockFilmDoc.id = mockFilmId

            const quoteId = faker.random.uuid()
            mockQuoteDoc.id = quoteId

            const quote: CreateQuote = {
                film: 'Star Wars',
                actor: 'Harrison Ford',
                quote: 'May the force be with you.',
            }
            const filmsSnapshot = {
                empty: false,
                docs: [
                    {
                        data: jest.fn(),
                        ref: mockFilmDoc,
                    },
                ],
            }

            mockFilmsCol.get.mockResolvedValue(filmsSnapshot)

            const publishSpy = jest.spyOn(pubsub, 'publish')

            const filmId = await service.create(quote)

            expect(mockFirestore.db.collection).toHaveBeenCalledWith(
                FS_FILMS_COL,
            )
            expect(mockFilmsCol.where).toBeCalledWith('title', '==', quote.film)
            expect(mockFilmDoc.collection).toHaveBeenCalledWith(FS_QUOTES_COL)
            expect(mockQuotesCol.add).toBeCalledWith({
                actor: quote.actor,
                quote: { en: quote.quote, fr: quote.quote }, // en quote fallback
            })
            expect(publishSpy).toHaveBeenCalledWith({
                filmId: mockFilmId,
                quoteId: quoteId,
                quote: quote.quote,
            })
            expect(filmId).toEqual(mockFilmId)
        })

        it('adds quote and creates film', async () => {
            const mockFilmId = faker.random.uuid()
            mockFilmDoc.id = mockFilmId

            const quoteId = faker.random.uuid()
            mockQuoteDoc.id = quoteId

            const quote: CreateQuote = {
                film: 'Star Wars',
                actor: 'Harrison Ford',
                quote: 'May the force be with you.',
            }
            const filmsSnapshot = {
                empty: true,
                docs: [],
            }

            mockFilmsCol.get.mockResolvedValue(filmsSnapshot)

            const publishSpy = jest.spyOn(pubsub, 'publish')

            const filmId = await service.create(quote)

            expect(mockFirestore.db.collection).toHaveBeenCalledWith(
                FS_FILMS_COL,
            )
            expect(mockFilmsCol.where).toBeCalledWith('title', '==', quote.film)
            expect(mockFilmDoc.collection).toHaveBeenCalledWith(FS_QUOTES_COL)
            expect(mockFilmsCol.add).toBeCalledWith({
                title: quote.film,
            })
            expect(mockQuotesCol.add).toBeCalledWith({
                actor: quote.actor,
                quote: { en: quote.quote, fr: quote.quote }, // en quote fallback
            })
            expect(publishSpy).toHaveBeenCalledWith({
                filmId: mockFilmId,
                quoteId: quoteId,
                quote: quote.quote,
            })
            expect(filmId).toEqual(mockFilmId)
        })

        it('finds duplicate film', async () => {
            const quote: CreateQuote = {
                film: 'Star Wars',
                actor: 'Harrison Ford',
                quote: 'May the force be with you.',
            }
            const filmsSnapshot = {
                empty: false,
                docs: [
                    {
                        id: faker.random.uuid(),
                        data: jest.fn(),
                    },
                    {
                        id: faker.random.uuid(),
                        data: jest.fn(),
                    },
                ],
            }

            mockFilmsCol.get.mockResolvedValue(filmsSnapshot)

            expect.assertions(1)
            try {
                await service.create(quote)
            } catch (e) {
                expect(e).toBeInstanceOf(Error)
            }
        })
    })
})
