import { Module } from '@nestjs/common'
import { PubSubService } from './pub-sub.service'

@Module({
    providers: [PubSubService],
})
export class PubSubModule {}
