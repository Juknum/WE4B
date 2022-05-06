import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  read(): Promise<User[]> {
    return this.userService.readAll();
  }

  @Post('create')
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id/update')
  async update(@Param('id') id: number, @Body() user: User): Promise<any> {
    user.id = Number(id);
    return this.userService.update(user);
  }

  @Delete(':id/delete')
  async delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(id);
  }
}
