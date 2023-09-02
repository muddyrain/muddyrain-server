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
import { ArticleService } from './article.service';
import { PagerQueryParams, ParamsType } from '@/common';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  create(@Body() body) {
    return this.articleService.create(body);
  }

  @Put(':id')
  update(@Body() body: any, @Param() param: ParamsType) {
    return this.articleService.update(body, param.id);
  }

  @Get()
  getAll(@Query() query: PagerQueryParams) {
    return this.articleService.findAll(query);
  }

  @Delete(':id')
  remove(@Param() param: ParamsType) {
    return this.articleService.remove(param.id);
  }
  @Get(':id')
  getById(@Param() param: ParamsType) {
    return this.articleService.getById(param.id);
  }
}
