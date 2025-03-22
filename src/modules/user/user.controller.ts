import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ResponseHelper } from '../../common/helpers/response.helper';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post('fetch')
  @HttpCode(200)
  async fetchAndSaveUsers() {
    await this.userService.fetchAndSaveUsers();
    return ResponseHelper.success('Users fetched and saved successfully!');
  }
}
