import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RecentActivity } from './recent-activity.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecentActivityService {
  constructor(
    @InjectRepository(RecentActivity)
    public readonly recentActivityRepository: Repository<RecentActivity>,
  ) {}
  create(body: RecentActivity) {
    const tmp = this.recentActivityRepository.create(body);
    return this.recentActivityRepository.save(tmp);
  }
}
