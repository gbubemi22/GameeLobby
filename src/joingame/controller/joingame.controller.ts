import { Controller, Get } from '@nestjs/common';
import { JoinGameService } from '../service/joingame.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('joingame')
export class JoingameController {
  constructor(private readonly joingameService: JoinGameService) {}

  @ApiOperation({ summary: 'Get Top 10 Players by wins' })
  @Get('top-players')
  getTopPlayers() {
    return this.joingameService.getTopTenPlayers();
  }
}
