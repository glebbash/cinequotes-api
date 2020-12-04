import { Firestore } from '@google-cloud/firestore'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FirestoreService {
    db = new Firestore({
        projectId: process.env.FIRESTORE_PROJECT_ID ?? 'dummy-test',
    })
}
