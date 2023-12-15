import { Controller, Get, Post } from '@nestjs/common';
import { RecentActivityService } from './recent-activity.service';

@Controller('recent-activity')
export class RecentActivityController {
  constructor(private readonly recentActivityService: RecentActivityService) {}

  @Get()
  findAll() {
    return this.recentActivityService.findAll();
  }
}
