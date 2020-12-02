import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateQuoteDto } from './create-quote.dto'
import { QuoteDto } from './quote.dto'
import { QuotesService } from './quotes.service'

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
    constructor(private quotes: QuotesService) {}

    @Get(':filmId')
    @ApiResponse({ status: 200, type: QuoteDto })
    @ApiNotFoundResponse()
    async getAllQuotesForFilm(
        @Param('filmId') filmId: string,
    ): Promise<QuoteDto[]> {
        return await this.quotes.byFilm(filmId)
    }

    @Post()
    async createNewQuote(@Body() quote: CreateQuoteDto) {
        await this.quotes.create(quote)
        return { message: 'ok' }
    }
}
