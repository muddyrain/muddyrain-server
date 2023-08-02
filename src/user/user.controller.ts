import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PagerQueryParams } from '@/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  @Get()
  getAll(@Query() query: PagerQueryParams) {
    return this.userService.findAll(query);
  }
}
