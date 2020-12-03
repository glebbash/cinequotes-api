import { ApiProperty } from '@nestjs/swagger'

export class QuoteNotFound {
    @ApiProperty({
        type: 'object',
        properties: {
            code: { default: 404 },
            message: { default: 'Not found' },
        },
    })
    error: any
}
