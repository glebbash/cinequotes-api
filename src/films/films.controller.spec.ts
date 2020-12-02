import { FirestoreModule } from '@/firestore/firestore.module'
import { PubSubModule } from '@/pub-sub/pub-sub.module'
import { Test, TestingModule } from '@nestjs/testing'
import { FilmsController } from './films.controller'
import { FilmsService } from './films.service'

describe('FilmsController', () => {
    let controller: FilmsController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FirestoreModule, PubSubModule],
            providers: [FilmsService],
            controllers: [FilmsController],
        }).compile()

        controller = module.get<FilmsController>(FilmsController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
