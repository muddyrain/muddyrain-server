import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { PagerQueryParams, ParamsType } from '@/common';
import { AuthPublicMeta } from '@/decorators/AuthPublicMeta.decorator';
import { Comment } from './Comment.entity';
import { ArticleTag } from './article.entity';

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
  @AuthPublicMeta()
  getAll(@Query() query: PagerQueryParams & { tag: ArticleTag }) {
    return this.articleService.findAll(query);
  }

  @Delete(':id')
  remove(@Param() param: ParamsType) {
    return this.articleService.remove(param.id);
  }

  @Get(':id')
  @AuthPublicMeta()
  getById(
    @Param() param: ParamsType,
    @Headers('Authorization') authorization: string,
  ) {
    return this.articleService.getById(param.id, authorization);
  }

  @Post('/like/:id')
  like(
    @Param() param: ParamsType,
    @Headers('Authorization') authorization: string,
  ) {
    return this.articleService.like(param.id, authorization);
  }

  @Post('/comment/:id')
  comment(
    @Param() param: ParamsType,
    @Body() body: Comment,
    @Headers('Authorization') authorization: string,
  ) {
    return this.articleService.comment(param.id, body, authorization);
  }

  @Delete('/comment/:id')
  removeComment(@Param() param: ParamsType) {
    return this.articleService.removeComment(param.id);
  }
}
