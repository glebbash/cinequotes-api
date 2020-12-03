import { ApiProperty } from '@nestjs/swagger'

export class CreateQuote {
    @ApiProperty()
    film: string

    @ApiProperty()
    actor: string

    @ApiProperty()
    quote: string
}
