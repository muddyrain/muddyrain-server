import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseHelper, ResponseReturn } from '@/common/ResponseHelper.filter';
import { PagerQueryParams, PrimaryKeyType } from '@/common';
import * as TurndownService from 'turndown';
import * as jwt from 'jsonwebtoken';
import { truncateString } from '@/utils';
import { RedisService } from '@/pipes/redis.pipe';
import { User } from '../user/user.entity';
import { UserLikeArticle } from './UserLikeArticle.entity';
import { Comment } from './Comment.entity';

const turndownService = new TurndownService();
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    public readonly ArticleRepository: Repository<Article>,
    @InjectRepository(Comment)
    public readonly CommentRepository: Repository<Comment>,
    @InjectRepository(UserLikeArticle)
    public readonly UserLikeArticleRepository: Repository<UserLikeArticle>,
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

  async update(body: Article, id: PrimaryKeyType) {
    const userTmp = await this.ArticleRepository.findOne({
      where: {
        id,
      },
    });
    await this.ArticleRepository.save({ ...userTmp, ...body });
    return ResponseHelper.success('Successfully modified');
  }
  async getById(id: PrimaryKeyType, authorization: string) {
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
          tmp.preview = tmp.preview + 1;
        }
      }
      const isLike = await this.UserLikeArticleRepository.findOne({
        where: {
          userId: user.id,
          articleId: id,
        },
      });
      if (tmp) {
        return ResponseHelper.success({
          ...tmp,
          isLike: !!isLike,
        });
      } else {
        return ResponseHelper.error(`Article ${id} does not exist`);
      }
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }

  async findAll(_params: PagerQueryParams, authorization: string) {
    const params = {
      page: 1,
      pageSize: 10,
      tag: undefined,
      ..._params,
    };
    const filter: FindOptionsWhere<Article> = {
      isDelete: false,
      tag: params.tag,
    };
    const data: (Article & { isLike?: boolean })[] =
      await this.ArticleRepository.find({
        skip: (+params.page - 1) * +params.pageSize,
        take: +params.pageSize,
        relations: ['user'],
        order: {
          createTime: 'ASC',
        },
        where: filter,
      });
    const user = jwt.decode(authorization) as User;
    for (const item of data) {
      if (user?.id) {
        const isUserLikeArticle =
          await this.UserLikeArticleRepository.findOneBy({
            userId: user?.id,
            articleId: item.id,
          });
        if (isUserLikeArticle) {
          item.isLike = true;
        } else {
          item.isLike = false;
        }
      } else {
        item.isLike = false;
      }
    }
    const total = await this.ArticleRepository.count({
      where: filter,
    });
    return ResponseHelper.success({
      data,
      total,
    });
  }

  async remove(ids: PrimaryKeyType | PrimaryKeyType[]) {
    const promiseList: Promise<ResponseReturn>[] = [];
    if (typeof ids === 'number') {
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

  async like(id: PrimaryKeyType, authorization: string) {
    if (isNaN(Number(id))) {
      return ResponseHelper.error('Article id is not a number');
    }
    const article = await this.ArticleRepository.findOne({
      where: {
        id,
      },
    });
    if (!article) {
      return ResponseHelper.error('Article not found');
    }
    const user = jwt.decode(authorization) as User;
    if (user) {
      const userLikeArticle = await this.UserLikeArticleRepository.findOne({
        where: {
          userId: user.id,
          articleId: id,
        },
      });
      if (userLikeArticle) {
        await this.UserLikeArticleRepository.delete({
          userId: user.id,
          articleId: id,
        });
        await this.ArticleRepository.decrement({ id }, 'like', 1);
      } else {
        await this.UserLikeArticleRepository.save({
          userId: user.id,
          articleId: id,
        });
        await this.ArticleRepository.increment({ id }, 'like', 1);
      }
      const tmp = await this.ArticleRepository.findOne({ where: { id } });
      return ResponseHelper.success(tmp);
    }
  }

  comment(id: PrimaryKeyType, body: Comment, authorization: string) {
    if (isNaN(Number(id))) {
      return ResponseHelper.error('Article id is not a number');
    }
    const user = jwt.decode(authorization) as User;
    if (user) {
      const article = this.ArticleRepository.findOneBy({
        id,
      });

      if (article) {
        const tmp = this.CommentRepository.create({
          ...body,
          article_id: id,
          user_id: user.id,
          parent_id: body.parent_id || 0,
        });
        this.CommentRepository.save(tmp);
        return ResponseHelper.success('Successfully commented');
      } else {
        return ResponseHelper.error('Article not found');
      }
    } else {
      return ResponseHelper.error('Please login first');
    }
  }

  async removeComment(commentId: PrimaryKeyType) {
    if (isNaN(Number(commentId))) {
      return ResponseHelper.error('Comment id is not a number');
    }
    await this.CommentRepository.update(
      {
        id: commentId,
      },
      {
        isDelete: true,
      },
    );
    return ResponseHelper.success('Successfully deleted');
  }
}
