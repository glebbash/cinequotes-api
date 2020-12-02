import { FirestoreService } from '@/firestore/firestore.service'
import { PubSubService } from '@/pub-sub/pub-sub.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateQuoteDto } from './create-quote.dto'
import { QuoteDto } from './quote.dto'

@Injectable()
export class QuotesService {
    constructor(
        private pubSub: PubSubService,
        private fireStore: FirestoreService,
    ) {}

    async byFilm(filmId: string): Promise<QuoteDto[]> {
        const quotes = await this.fireStore.db
            .collection('films')
            .doc(filmId)
            .collection('quotes')
            .get()

        if (quotes.empty) {
            throw new NotFoundException()
        }

        return quotes.docs.map((q) => q.data() as QuoteDto)
    }

    async create(req: CreateQuoteDto) {
        const films = await this.fireStore.db
            .collection('films')
            .where('title', '==', req.film)
            .get()

        if (films.size > 1) {
            throw new Error('Film duplicate name=' + req.film)
        }

        const filmRef = !films.empty
            ? films.docs[0].ref
            : await this.fireStore.db
                  .collection('films')
                  .add({ name: req.film })

        const quoteRef = await filmRef.collection('quotes').add({
            actor: req.actor,
            quote: { en: req.quote },
        })

        this.pubSub.publish({ quoteId: quoteRef.id, text: req.quote })

        return { message: 'ok' }
    }
}
