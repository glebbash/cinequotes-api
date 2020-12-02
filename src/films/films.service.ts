import { FirestoreService } from '@/firestore/firestore.service'
import { Injectable } from '@nestjs/common'
import { FilmDto } from './film.dto'

@Injectable()
export class FilmsService {
    constructor(private fireStore: FirestoreService) {}

    async getAll(): Promise<FilmDto[]> {
        const films = await this.fireStore.db
            .collection('films')
            .select('name')
            .get()

        return films.docs.map((film) => ({
            id: film.id,
            title: film.data().name,
        }))
    }
}