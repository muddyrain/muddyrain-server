import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { UserLikeArticle } from './UserLikeArticle.entity';
import { Comment } from './Comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, UserLikeArticle, Comment])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
