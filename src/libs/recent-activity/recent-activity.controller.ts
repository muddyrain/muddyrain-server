import { Body, Controller, Post } from '@nestjs/common';
import { RecentActivityService } from './recent-activity.service';

@Controller('template')
export class RecentActivityController {
  constructor(private readonly recentActivityService: RecentActivityService) {}
  @Post()
  create(@Body() body) {
    return this.recentActivityService.create(body);
  }
}
