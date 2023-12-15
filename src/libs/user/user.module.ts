import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RecentActivity } from '../recent-activity/recent-activity.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, RecentActivity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
