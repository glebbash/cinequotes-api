import { PUBSUB_TOPIC } from '@/common/constants'
import { GcloudPubSubService } from '@ecobee/nodejs-gcloud-pubsub-module'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PubSubService {
    constructor(private readonly gcloudPubSubService: GcloudPubSubService) {}

    async publish(payload: Record<string, any>) {
        const serializedPayload = JSON.stringify(payload)
        return await this.gcloudPubSubService.publishMessage(
            PUBSUB_TOPIC,
            serializedPayload,
        )
    }
}
