import { FS_FILMS_COL, FS_QUOTES_COL } from '@/common/constants'
import { FirestoreService } from '@/firestore/firestore.service'
import { PubSubService } from '@/pub-sub/pub-sub.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateQuote } from './create-quote.model'
import { Quote } from './quote.model'

@Injectable()
export class QuotesService {
    constructor(
        private pubSub: PubSubService,
        private firestore: FirestoreService,
    ) {}

    async byFilm(filmId: string): Promise<Quote[]> {
        const quotes = await this.firestore.db
            .collection(FS_FILMS_COL)
            .doc(filmId)
            .collection(FS_QUOTES_COL)
            .get()

        if (quotes.empty) {
            throw new NotFoundException()
        }

        return quotes.docs.map((q) => q.data() as Quote)
    }

    async create(req: CreateQuote): Promise<string> {
        const films = await this.firestore.db
            .collection(FS_FILMS_COL)
            .where('title', '==', req.film)
            .get()

        if (films.size > 1) {
            throw new Error(`Found duplicate film '${req.film}'`)
        }

        const filmRef = !films.empty
            ? films.docs[0].ref
            : await this.firestore.db
                  .collection(FS_FILMS_COL)
                  .add({ name: req.film })

        const quoteRef = await filmRef.collection(FS_QUOTES_COL).add({
            actor: req.actor,
            quote: { en: req.quote, fr: req.quote }, // en quote fallback
        })

        this.pubSub.publish({
            filmId: filmRef.id,
            quoteId: quoteRef.id,
            text: req.quote,
        })

        return filmRef.id
    }
}
