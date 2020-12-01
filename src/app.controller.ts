import { Controller, Get } from '@nestjs/common'
import { PubSubService } from './pub-sub/pub-sub.service'

@Controller()
export class AppController {
    constructor(private pubSub: PubSubService) {}

    @Get()
    getHello(): string {
        return 'Hello'
    }
}
