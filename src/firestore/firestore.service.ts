import { Injectable } from '@nestjs/common'
import { Firestore } from '@google-cloud/firestore'

@Injectable()
export class FirestoreService {
    db = new Firestore({ projectId: 'dummy' })
}
