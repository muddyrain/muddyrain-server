import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RecentActivity } from './recent-activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseHelper } from '@/common/ResponseHelper.filter';

@Injectable()
export class RecentActivityService {
  constructor(
    @InjectRepository(RecentActivity)
    public readonly recentActivityRepository: Repository<RecentActivity>,
  ) {}
  async findAll() {
    // 查询最新的10条记录
    const result = await this.recentActivityRepository.find({
      order: {
        createTime: 'DESC',
      },
      relations: ['user'],
      take: 10,
    });
    return ResponseHelper.success(result);
  }
}
