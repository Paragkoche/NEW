import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Users } from 'src/api/users/enititys/user.enitity';
import { deCodeJwtToken } from 'src/utility/jwt_payload.utility';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(Users)
    private readonly UserRepo: Repository<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });
      const { id, username } = deCodeJwtToken(payload.token);
      const user = await this.UserRepo.findOne({
        where: {
          id: id,
          username,
        },
      });
      if (!user) {
        throw new UnauthorizedException('token invalid!!');
      }

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
