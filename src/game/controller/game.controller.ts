import { Controller, Get, Query } from '@nestjs/common';
import { GameService } from '../service/game.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter sessions by YYYY-MM-DD format',
  })
  @Get('group-by-date')
  async groupByDate(@Query('date') date?: string) {
    return await this.gameService.groupSessionsByDate(date);
  }
}
