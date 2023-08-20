import { Body, Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  create(@Body() body) {
    return this.articleService.create(body);
  }
}
