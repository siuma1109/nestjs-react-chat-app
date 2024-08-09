import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user) {
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return user;
  }
}
