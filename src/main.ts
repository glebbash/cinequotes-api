import { GcloudPubSubService } from '@ecobee/nodejs-gcloud-pubsub-module'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder'
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/all-exceptions-filter'
import { PUBSUB_TOPIC, PUBSUB_SUBSCRIPTION } from './common/constants'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const options = new DocumentBuilder()
        .setTitle('Cinequotes API')
        .setDescription('Cinequotes API interactive demo')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)

    const pubsub = app.get(GcloudPubSubService).gcloudPubSubLib
    await pubsub.topic(PUBSUB_TOPIC).subscription(PUBSUB_SUBSCRIPTION).get()

    app.useGlobalFilters(new AllExceptionsFilter())

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
