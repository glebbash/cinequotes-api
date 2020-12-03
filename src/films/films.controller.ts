import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Film } from './film.model'
import { FilmsService } from './films.service'

@ApiTags('films')
@Controller('films')
export class FilmsController {
    constructor(private films: FilmsService) {}

    @Get()
    @ApiResponse({ status: 200, type: [Film] })
    async getAllFilms(): Promise<Film[]> {
        return await this.films.getAll()
    }
}
