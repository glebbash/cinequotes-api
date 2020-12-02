import { GcloudPubSubModule } from '@ecobee/nodejs-gcloud-pubsub-module'
import { Test, TestingModule } from '@nestjs/testing'
import { PubSubService } from './pub-sub.service'

describe('PubSubService', () => {
    let service: PubSubService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                GcloudPubSubModule.forRoot({
                    authOptions: {
                        projectId: 'dummy',
                        uri: process.env.PUBSUB_EMULATOR_HOST,
                    },
                }),
            ],
            providers: [PubSubService],
        }).compile()

        service = module.get<PubSubService>(PubSubService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
