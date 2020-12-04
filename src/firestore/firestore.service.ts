import { Injectable } from '@nestjs/common'
import { Firestore } from '@google-cloud/firestore'

@Injectable()
export class FirestoreService {
    db: Firestore

    constructor(projectId: string) {
        this.db = new Firestore({ projectId })
    }
}
