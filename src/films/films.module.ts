import { FirestoreModule } from '@/firestore/firestore.module'
import { Module } from '@nestjs/common'
import { FilmsController } from './films.controller'
import { FilmsService } from './films.service'

@Module({
    imports: [FirestoreModule],
    controllers: [FilmsController],
    providers: [FilmsService],
})
export class FilmsModule {}
