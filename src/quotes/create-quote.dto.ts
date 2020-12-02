import { ApiProperty } from '@nestjs/swagger'

export class CreateQuoteDto {
    @ApiProperty()
    film: string

    @ApiProperty()
    actor: string

    @ApiProperty()
    quote: string
}
