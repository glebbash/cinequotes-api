import { PUBSUB_TOPIC } from '@/common/constants'
import { GcloudPubSubService } from '@ecobee/nodejs-gcloud-pubsub-module'
import { Test, TestingModule } from '@nestjs/testing'
import { PubSubService } from './pub-sub.service'
import * as faker from 'faker'

jest.mock('@ecobee/nodejs-gcloud-pubsub-module')

describe('PubSubService', () => {
    let pubsub: GcloudPubSubService
    let service: PubSubService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GcloudPubSubService, PubSubService],
        }).compile()

        service = module.get(PubSubService)
        pubsub = module.get(GcloudPubSubService)
    })

    it('publishes stringified messages', async (done) => {
        const message = {
            actor: faker.name.findName(),
        }
        const json = JSON.stringify(message)
        const mockResult = 'result'

        const publishSpy = jest
            .spyOn(pubsub, 'publishMessage')
            .mockResolvedValue(mockResult)

        const result = await service.publish(message)

        expect(publishSpy).toBeCalledWith(PUBSUB_TOPIC, json)
        expect(result).toEqual(mockResult)
        done()
    })
})
