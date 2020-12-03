import { ApiProperty } from '@nestjs/swagger'

export class Quote {
    @ApiProperty()
    film: string

    @ApiProperty()
    actor: string

    @ApiProperty()
    quote: string
}
