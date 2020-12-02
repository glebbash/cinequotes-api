import { GcloudPubSubModule } from '@ecobee/nodejs-gcloud-pubsub-module'
import { Module } from '@nestjs/common'
import { PubSubService } from './pub-sub.service'
import * as grpc from '@grpc/grpc-js'

@Module({
    imports: [
        GcloudPubSubModule.forRoot({
            authOptions: {
                projectId: 'dummy',
                uri: 'localhost:8085',
                credentials: grpc.credentials.createInsecure(),
            },
        }),
    ],
    providers: [PubSubService],
    exports: [PubSubService],
})
export class PubSubModule {}
