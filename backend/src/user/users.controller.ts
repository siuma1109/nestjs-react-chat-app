import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return {
      statusCode: 200,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Request() req, @Param('id') id: bigint, @Body() request) {
    if (req.user.id !== id) {
      return {
        statusCode: 403,
        message: 'No permission to update.',
      };
    }
    await this.userService.update({ id, ...request });
    return {
      statusCode: '200',
      message: 'User updated successfully.',
    };
  }
}
