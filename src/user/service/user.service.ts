import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(payload: UserDto) {
    try {
      const { username } = payload;
      const checkUser = await this.userModel.findOne({ username: username });

      if (checkUser) throw new ConflictException(`User already exits`);

      const user = await this.userModel.create({ username });

      return {
        success: true,
        message: `User created successfully`,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(payload: UserDto) {
    try {
      const { username } = payload;
      const user = await this.userModel.findOne({ username: username });

      if (!user) throw new UnauthorizedException(`User not found`);

      return {
        accessToken: await this.jwtService.signAsync({
          username: user.username,
        }),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(username: string) {
    try {
      const user = await this.userModel.findOne({ username: username });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
