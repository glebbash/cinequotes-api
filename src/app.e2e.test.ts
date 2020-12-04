process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8505'
process.env.PUBSUB_EMULATOR_HOST = 'localhost:8085'
process.env.FIRESTORE_PROJECT_ID = 'dummy-test'

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { FirestoreService } from '@/firestore/firestore.service'
import { FS_FILMS_COL, FS_QUOTES_COL } from './common/constants'
import { GcloudPubSubService } from '@ecobee/nodejs-gcloud-pubsub-module'
import { configureApp } from '@/configure-app'
import fetch from 'node-fetch'
import * as supertest from 'supertest'
import { PubSubService } from './pub-sub/pub-sub.service'

describe('AppController (e2e)', () => {
    let request: supertest.SuperTest<supertest.Test>
    let app: INestApplication
    let firestore: FirestoreService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = module.createNestApplication()
        firestore = module.get(FirestoreService)

        await configureApp(app)
        await app.init()
        await clearDb()

        request = supertest(app.getHttpServer())
    })

    afterEach(async (done) => {
        await app.close()
        done()
    })

    describe('Firestore', () => {
        it('connects successfuly', async (done) => {
            const firestore = app.get(FirestoreService)

            const res = await firestore.db
                .collection(FS_FILMS_COL)
                .limit(1)
                .get()

            expect(res).toBeDefined()
            done()
        })
    })

    describe('Pubsub', () => {
        it('connects successfuly', async (done) => {
            const pubsub = app.get(GcloudPubSubService)

            const topic = await pubsub.gcloudPubSubLib.getTopics({
                pageSize: 1,
            })

            expect(topic).toBeDefined()
            done()
        })
    })

    describe('GET /docs/', () => {
        it('shows docs page', async () => {
            const response = await request.get(`/docs/`)
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toMatch(/text\/html/)
        })
    })

    describe('GET /films', () => {
        it('gets all films from db', async (done) => {
            const filmRef = await firestore.db.collection(FS_FILMS_COL).add({
                title: 'Star Wars',
            })
            const response = await request.get('/films')

            expect(response.status).toBe(200)
            expect(response.body).toEqual([
                {
                    id: filmRef.id,
                    title: 'Star Wars',
                },
            ])
            done()
        })
    })

    describe('GET /quotes/:filmId?lang=?', () => {
        it('finds quotes for existing film', async (done) => {
            const filmRef = await firestore.db.collection(FS_FILMS_COL).add({
                title: 'Star Wars',
            })
            await filmRef.collection(FS_QUOTES_COL).add({
                actor: 'Harrison Ford',
                quote: {
                    en: 'May the force be with you.',
                    fr: 'Que la force soit avec toi.',
                },
            })

            const response = await request.get(`/quotes/${filmRef.id}?lang=fr`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual([
                {
                    actor: 'Harrison Ford',
                    quote: 'Que la force soit avec toi.',
                },
            ])
            done()
        })

        it('returns 404 for unknown filmId', async (done) => {
            const response = await request.get(`/quotes/123?lang=en`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                error: {
                    code: 404,
                    message: 'Not Found',
                },
            })
            done()
        })
    })

    describe('POST /quotes', () => {
        it('creates new quote', async (done) => {
            const filmRef = await firestore.db.collection(FS_FILMS_COL).add({
                title: 'Star Wars',
            })

            const pubsub = app.get(PubSubService)
            const publishSpy = jest
                .spyOn(pubsub, 'publish')
                .mockReturnValue(null)

            const response = await request.post('/quotes').send({
                film: 'Star Wars',
                actor: 'Harrison Ford',
                quote: 'May the force be with you.',
            })

            const createdQuotesSnapshot = await filmRef
                .collection(FS_QUOTES_COL)
                .get()
            const createdQuoteRef = createdQuotesSnapshot.docs[0]
            const createdQuote = createdQuoteRef.data()

            expect(createdQuotesSnapshot.docs.length).toBe(1)
            expect(createdQuote).toEqual({
                actor: 'Harrison Ford',
                quote: {
                    en: 'May the force be with you.',
                    fr: 'May the force be with you.',
                },
            })

            expect(publishSpy).toBeCalledWith({
                filmId: filmRef.id,
                quoteId: createdQuoteRef.id,
                quote: 'May the force be with you.',
            })

            expect(response.status).toBe(201)
            expect(response.body).toEqual({
                filmId: filmRef.id,
            })
            done()
        })
    })
})

async function clearDb() {
    await fetch(
        `http://localhost:8505/emulator/v1/projects/dummy-test/databases/(default)/documents`,
        { method: 'DELETE' },
    )
}
