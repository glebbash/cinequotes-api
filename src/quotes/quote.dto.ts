import { ApiProperty } from '@nestjs/swagger'

export class QuoteDto {
    @ApiProperty()
    film: string

    @ApiProperty()
    actor: string

    @ApiProperty({
        type: 'object',
        properties: {
            en: { type: 'string' },
            fr: { type: 'string' },
        },
    })
    quote: {
        en: string
        fr: string
    }
}
