import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateQuote } from './create-quote.model'
import { Quote } from './quote.model'
import { QuotesService } from './quotes.service'

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
    constructor(private quotes: QuotesService) {}

    @Get(':filmId')
    @ApiResponse({ status: 200, type: Quote })
    @ApiNotFoundResponse()
    async getAllQuotesForFilm(
        @Param('filmId') filmId: string,
    ): Promise<Quote[]> {
        return await this.quotes.byFilm(filmId)
    }

    @Post()
    async createNewQuote(@Body() quote: CreateQuote) {
        const filmId = await this.quotes.create(quote)
        return { filmId }
    }
}
