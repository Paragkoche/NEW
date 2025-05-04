import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './enititys/user.enitity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { isValidPwdFun } from 'src/utility/password.utility';
import { makeJWtToken } from 'src/utility/jwt_payload.utility';
import { CreateDTO } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly UserRepo: Repository<Users>,
  ) {}

  async Login(data: LoginDTO) {
    const user = await this.UserRepo.findOne({
      where: {
        username: data.username,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('user not found');
    }
    const isValidPwd = await isValidPwdFun(data.password, user.password);
    if (!isValidPwd) {
      throw new UnauthorizedException('password not valid!!');
    }
    const payload = { token: makeJWtToken(user.id, user.username) };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user,
    };
  }
  async Create(data: CreateDTO) {
    const user = await this.UserRepo.findOne({
      where: {
        username: data.username,
      },
    });
    if (user) {
      throw new UnprocessableEntityException('user already exits');
    }
    const newUser = this.UserRepo.create({
      username: data.username,
      password: data.password,
    });
    const userData = await this.UserRepo.save(newUser);
    const payload = { token: makeJWtToken(userData.id, userData.username) };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user,
    };
  }
}
