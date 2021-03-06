import { GcloudPubSubService } from '@ecobee/nodejs-gcloud-pubsub-module'
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from './common/all-exceptions-filter'
import { setupPubSub } from './common/setup-pub-sub'

export async function configureApp(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('Cinequotes API')
        .setDescription('Cinequotes API interactive demo')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)

    const pubsub = app.get(GcloudPubSubService).gcloudPubSubLib
    await setupPubSub(pubsub)

    app.useGlobalFilters(new AllExceptionsFilter())
}
