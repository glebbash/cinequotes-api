import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { FirestoreService } from '@/firestore/firestore.service'
import { FS_FILMS_COL } from './common/constants'
import { GcloudPubSubService } from '@ecobee/nodejs-gcloud-pubsub-module'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = module.createNestApplication()
        await app.init()
    })

    it('connects to firestore', async () => {
        const firestore = app.get(FirestoreService)

        const res = await firestore.db.collection(FS_FILMS_COL).limit(1).get()

        expect(res).toBeDefined()
    })

    it('connects to pubsub', async () => {
        const pubsub = app.get(GcloudPubSubService)

        const topic = await pubsub.gcloudPubSubLib.getTopics({ pageSize: 1 })

        expect(topic).toBeDefined()
    })
})
