import { Firestore } from '@google-cloud/firestore'

export class FirestoreService {
    db = new Firestore({
        projectId: process.env.FIRESTORE_PROJECT_ID ?? 'dummy-test',
    })
}
