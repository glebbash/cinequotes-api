import { ApiProperty } from '@nestjs/swagger'

export class QuoteCreated {
    @ApiProperty()
    filmId: string
}
