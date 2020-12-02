import { FirestoreService } from './firestore.service'

jest.setTimeout(70000)

describe('FirestoreService', () => {
    let service: FirestoreService

    beforeEach(async () => {
        service = new FirestoreService()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should connect to emulator', async () => {
        await service.db.collection('films').get()
    })
})
