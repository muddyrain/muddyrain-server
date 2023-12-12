import { Module } from '@nestjs/common';
import { RecentActivityController } from './recent-activity.controller';
import { RecentActivityService } from './recent-activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecentActivity } from './recent-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecentActivity])],
  controllers: [RecentActivityController],
  providers: [RecentActivityService],
})
export class RecentActivityModule {}
