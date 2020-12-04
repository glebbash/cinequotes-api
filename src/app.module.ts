import { Module } from '@nestjs/common'
import { PubSubModule } from '@/pub-sub/pub-sub.module'
import { QuotesModule } from '@/quotes/quotes.module'
import { FilmsModule } from '@/films/films.module'
import { FirestoreModule } from '@/firestore/firestore.module'

@Module({
    imports: [
        FirestoreModule.forRoot(),
        PubSubModule,
        QuotesModule,
        FilmsModule,
    ],
})
export class AppModule {}
