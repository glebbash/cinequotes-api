
import { Body, Controller, Get, Optional, Param, Post, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateQuote } from './models/create-quote.model'
import { QuoteCreated } from './models/quote-created.model'
import { QuoteNotFound } from './models/quote-not-found.model'
import { Quote } from './models/quote.model'
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
        @Query('lang') language: string,
    ): Promise<Quote[]> {
        return await this.quotes.getByFilm(filmId, language)
    }

    @Post()
    @ApiResponse({ status: 201, type: QuoteCreated })
    async createNewQuote(@Body() quote: CreateQuote): Promise<QuoteCreated> {
        const filmId = await this.quotes.create(quote)
        return { filmId }
    }
}
