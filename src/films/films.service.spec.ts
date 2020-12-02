import { FirestoreModule } from '@/firestore/firestore.module'
import { Test, TestingModule } from '@nestjs/testing'
import { FilmsService } from './films.service'

describe('FilmsService', () => {
    let service: FilmsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FirestoreModule],
            providers: [FilmsService],
        }).compile()

        service = module.get<FilmsService>(FilmsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
