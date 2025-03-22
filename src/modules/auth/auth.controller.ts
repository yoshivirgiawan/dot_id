import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return ResponseHelper.success('Login successful', token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fetch')
  async getProfile(@Request() req: any) {
    const userId = req.user.id;
    const user = await this.authService.getProfile(userId);

    return ResponseHelper.success('User fetched successfully', user);
  }
}
