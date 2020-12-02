import { FirestoreModule } from '@/firestore/firestore.module'
import { PubSubModule } from '@/pub-sub/pub-sub.module'
import { Test, TestingModule } from '@nestjs/testing'
import { QuotesService } from './quotes.service'

describe('QuotesService', () => {
    let service: QuotesService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FirestoreModule, PubSubModule],
            providers: [QuotesService],
        }).compile()

        service = module.get<QuotesService>(QuotesService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
