import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    public readonly ArticleRepository: Repository<Article>,
  ) {}
  create(body: Article) {
    const tmp = this.ArticleRepository.create(body);
    return this.ArticleRepository.save(tmp);
  }
}
