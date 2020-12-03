import { FS_FILMS_COL } from '@/common/constants'
import { FirestoreService } from '@/firestore/firestore.service'
import { Injectable } from '@nestjs/common'
import { Film } from './film.model'

@Injectable()
export class FilmsService {
    constructor(private fireStore: FirestoreService) {}

    async getAll(): Promise<Film[]> {
        const films = await this.fireStore.db
            .collection(FS_FILMS_COL)
            .select('title')
            .get()

        return films.docs.map((film) => ({
            id: film.id,
            title: film.data().title,
        }))
    }
}
