import { FS_FILMS_COL } from '@/common/constants'
import { FirestoreService } from './firestore.service'

describe('FirestoreService', () => {
    let service: FirestoreService

    beforeEach(async () => {
        service = new FirestoreService()
    })

    it('connects to emulator', async () => {
        await service.db.collection(FS_FILMS_COL).get()
    })
})
