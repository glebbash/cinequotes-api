import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { FilmDto } from './film.dto'
import { FilmsService } from './films.service'

@ApiTags('films')
@Controller('films')
export class FilmsController {
    constructor(private films: FilmsService) {}

    @Get()
    @ApiResponse({ status: 200, type: [FilmDto] })
    async getAllFilms(): Promise<FilmDto[]> {
        return await this.films.getAll()
    }
}
