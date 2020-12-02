import { FirestoreModule } from '@/firestore/firestore.module'
import { PubSubModule } from '@/pub-sub/pub-sub.module'
import { Test, TestingModule } from '@nestjs/testing'
import { QuotesController } from './quotes.controller'
import { QuotesService } from './quotes.service'

describe('QuotesController', () => {
    let controller: QuotesController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FirestoreModule, PubSubModule],
            providers: [QuotesService],
            controllers: [QuotesController],
        }).compile()

        controller = module.get<QuotesController>(QuotesController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
