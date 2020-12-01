import { GcloudPubSubModule } from '@ecobee/nodejs-gcloud-pubsub-module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PubSubModule } from './pub-sub/pub-sub.module'

@Module({
    imports: [
        GcloudPubSubModule.forRoot({
            authOptions: {
                projectId: 'dummy',
                uri: 'localhost:8085',
            },
        }),
        PubSubModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
