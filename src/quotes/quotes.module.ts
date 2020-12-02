import { FirestoreModule } from '@/firestore/firestore.module'
import { PubSubModule } from '@/pub-sub/pub-sub.module'
import { Module } from '@nestjs/common'
import { QuotesController } from './quotes.controller'
import { QuotesService } from './quotes.service'

@Module({
    imports: [PubSubModule, FirestoreModule],
    controllers: [QuotesController],
    providers: [QuotesService],
})
export class QuotesModule {}
