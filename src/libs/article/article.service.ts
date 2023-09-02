import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseHelper, ResponseReturn } from '@/common/ResponseHelper.filter';
import { PagerQueryParams } from '@/common';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    public readonly ArticleRepository: Repository<Article>,
  ) {}
  async create(body: Article) {
    try {
      const tmp = this.ArticleRepository.create(body);
      await this.ArticleRepository.save(tmp);
      return ResponseHelper.success('Successfully created');
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
    const userTmp = await this.ArticleRepository.findOne({
      where: {
        id,
      },
    });
    return ResponseHelper.success(userTmp);
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
