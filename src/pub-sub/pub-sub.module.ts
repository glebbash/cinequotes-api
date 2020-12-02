import { GcloudPubSubModule } from '@ecobee/nodejs-gcloud-pubsub-module'
import { Module } from '@nestjs/common'
import { PubSubService } from './pub-sub.service'

@Module({
    imports: [
        GcloudPubSubModule.forRoot({
            authOptions: {
                projectId: 'dummy',
                uri: process.env.PUBSUB_EMULATOR_HOST,
            },
        }),
    ],
    providers: [PubSubService],
    exports: [PubSubService],
})
export class PubSubModule {}
