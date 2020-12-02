import { ApiProperty } from '@nestjs/swagger'

export class FilmDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    title: string
}
