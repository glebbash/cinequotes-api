import { ApiProperty } from '@nestjs/swagger'

export class Quote {
    @ApiProperty()
    actor: string

    @ApiProperty()
    quote: string
}
