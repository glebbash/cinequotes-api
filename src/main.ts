process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8505'
process.env.PUBSUB_EMULATOR_HOST = 'localhost:8085'
process.env.FIRESTORE_PROJECT_ID = 'dummy-prod'

import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { configureApp } from '@/configure-app'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await configureApp(app)
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
