import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateQuote } from './create-quote.model'
import { QuoteCreated } from './quote-created.model'
import { QuoteNotFound } from './quote-not-found.model'
import { Quote } from './quote.model'
import { QuotesService } from './quotes.service'

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
    constructor(private quotes: QuotesService) {}

    @Get(':filmId')
    @ApiResponse({ status: 200, type: Quote })
    @ApiNotFoundResponse({ type: QuoteNotFound })
    async getAllQuotesForFilm(
        @Param('filmId') filmId: string,
    ): Promise<Quote[]> {
        return await this.quotes.byFilm(filmId)
    }

    @Post()
    @ApiResponse({ status: 201, type: QuoteCreated })
    async createNewQuote(@Body() quote: CreateQuote): Promise<QuoteCreated> {
        const filmId = await this.quotes.create(quote)
        return { filmId }
    }
}
