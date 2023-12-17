import { Controller, Get, Post } from '@nestjs/common';
import { RecentActivityService } from './recent-activity.service';
import { AuthPublicMeta } from '@/decorators/AuthPublicMeta.decorator';

@Controller('recent-activity')
export class RecentActivityController {
  constructor(private readonly recentActivityService: RecentActivityService) {}

  @Get()
  @AuthPublicMeta()
  findAll() {
    return this.recentActivityService.findAll();
  }
}
