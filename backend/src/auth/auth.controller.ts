import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() request) {
    return await this.authService.register(request);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request, @Res() res) {
    const authUserDto: AuthUserDto = {
      id: request.user.id,
      email: request.user.email,
      name: request.user.name,
    };

    return res.status(200).json(await this.authService.login(authUserDto));
  }
}
