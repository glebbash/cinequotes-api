import { ApiProperty } from '@nestjs/swagger'

export class Film {
    @ApiProperty()
    id: string

    @ApiProperty()
    title: string
}
