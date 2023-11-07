import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PagerQueryParams, ParamsType } from '@/common';
import { User } from './user.entity';
import { AuthPublicMeta } from '@/decorators/AuthPublicMeta.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: any) {
    return this.userService.create(body);
  }

  @Get()
  getAll(@Query() query: PagerQueryParams) {
    return this.userService.findAll(query);
  }

  @Delete()
  removeMore(@Body() body: any) {
    return this.userService.remove(body.ids);
  }

  @Post('login')
  @AuthPublicMeta()
  login(@Body() body: { userName: string; password: string }) {
    return this.userService.login(body);
  }

  @Post('register')
  register(@Body() body: User) {
    return this.userService.create(body);
  }

  @Put(':id')
  update(@Body() body: any, @Param() param: ParamsType) {
    return this.userService.update(body, param.id);
  }

  @Delete(':id')
  remove(@Param() param: ParamsType) {
    return this.userService.remove(param.id);
  }
}
