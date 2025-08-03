import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserDto } from '../dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginUserDto: UserDto) {
    return this.userService.login(loginUserDto);
  }
}
