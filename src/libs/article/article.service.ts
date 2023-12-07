import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseHelper, ResponseReturn } from '@/common/ResponseHelper.filter';
import { PagerQueryParams } from '@/common';
import * as TurndownService from 'turndown';
import * as jwt from 'jsonwebtoken';
import { truncateString } from '@/utils';
import { RedisService } from '@/pipes/redis.pipe';
import { User } from '../user/user.entity';

const turndownService = new TurndownService();
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    public readonly ArticleRepository: Repository<Article>,
    private readonly redisService: RedisService,
  ) {}

  async create(body: Article) {
    try {
      const tmp = this.ArticleRepository.create({
        ...body,
        brief_content: truncateString(
          turndownService.turndown(body.content),
          100,
        ),
      });
      await this.ArticleRepository.save(tmp);
      return ResponseHelper.success(tmp);
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }

  async update(body: Article, id: string) {
    const userTmp = await this.ArticleRepository.findOne({
      where: {
        id,
      },
    });
    await this.ArticleRepository.save({ ...userTmp, ...body });
    return ResponseHelper.success('Successfully modified');
  }
  async getById(id: string, authorization: string) {
    try {
      const user = jwt.decode(authorization) as User;
      const tmp = await this.ArticleRepository.findOne({
        where: {
          id,
        },
        relations: ['user'],
      });
      // 发送消息到指定频道
      if (user) {
        const key = `muddyrain-article-preview-${id}-${user.id}`;
        const response = await this.redisService.getCache(key);
        if (!response) {
          await this.redisService.setCache(key, 1, 60 * 5);
          // 给文章预览数加一
          await this.ArticleRepository.increment({ id }, 'preview', 1);
          // 更新现有的文章预览数
          tmp.preview += 1;
        }
      }
      if (tmp) {
        return ResponseHelper.success(tmp);
      } else {
        return ResponseHelper.error(`Article ${id} does not exist`);
      }
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }

  async findAll(_params: PagerQueryParams) {
    const params = {
      page: 1,
      pageSize: 10,
      ..._params,
    };
    const filter = {
      isDelete: false,
    };
    const data = await this.ArticleRepository.find({
      skip: (+params.page - 1) * +params.pageSize,
      take: +params.pageSize,
      relations: ['user'],
      order: {
        createTime: 'ASC',
      },
      where: filter,
    });
    const total = await this.ArticleRepository.count({
      where: filter,
    });
    return ResponseHelper.success({
      data,
      total,
    });
  }

  async remove(ids: string | string[]) {
    const promiseList: Promise<ResponseReturn>[] = [];
    if (typeof ids === 'string') {
      ids = [ids];
    }
    for (const id of ids) {
      promiseList.push(this.update({ isDelete: true } as Article, id));
    }
    try {
      await Promise.all(promiseList);
      return ResponseHelper.success('Successfully deleted');
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }
}
