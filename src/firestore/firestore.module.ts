import { DynamicModule, Module } from '@nestjs/common'
import { FirestoreService } from './firestore.service'

@Module({
    providers: [FirestoreService],
    exports: [FirestoreService],
})
export class FirestoreModule {
    static forRoot(projectId = 'dummy-prod'): DynamicModule {
        return {
            module: FirestoreModule,
            providers: [
                {
                    provide: FirestoreService,
                    useValue: new FirestoreService(projectId),
                },
            ],
            exports: [FirestoreService],
        }
    }
}
