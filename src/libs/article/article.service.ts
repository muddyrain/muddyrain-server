import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseHelper, ResponseReturn } from '@/common/ResponseHelper.filter';
import { PagerQueryParams } from '@/common';
import * as TurndownService from 'turndown';
import { truncateString } from '@/utils';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { envConfig } from '@/constant/config';

const turndownService = new TurndownService();
@Injectable()
export class ArticleService {
  private readonly redisClient: ClientProxy;
  constructor(
    @InjectRepository(Article)
    public readonly ArticleRepository: Repository<Article>, // @Inject('REDIS_CLIENT') private redisClient: ClientProxy,
  ) {
    this.redisClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: envConfig('REDIS_HOST'),
        port: +envConfig('REDIS_PORT'),
        password: envConfig('REDIS_PASSWORD'),
      },
    });
  }

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
  async getById(id: string) {
    try {
      // const userTmp = await this.ArticleRepository.findOne({
      //   where: {
      //     id,
      //   },
      //   relations: ['user'],
      // });
      // return ResponseHelper.success(userTmp);
      // 发送消息到指定频道
      this.redisClient
        .connect()
        .then(() => {
          console.log('redis connect success');
          const data = {
            key: 'myKey',
            value: 'myValue',
          };
          this.redisClient.send('my_channel', data);
        })
        .finally(() => {
          this.redisClient.close();
        });

      // console.log('Redis response:', response);
      return 1;
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
