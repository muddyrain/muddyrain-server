import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './libs/user/user.module';
import { BannerModule } from './libs/banner/banner.module';
import { LogService } from './libs/log/log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './libs/log/log.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { FormatDateInterceptor } from './Interceptors/FormatDateInterceptor';
import { ArticleModule } from './libs/article/article.module';
import { ChatModule } from './libs/chat/chat.module';
import { UtilsModule } from './libs/utils/utils.module';
import { GlobalAuthGuard } from './guard/auth.guard';
import { AppService } from './app.service';
import { RedisService } from './pipes/redis.pipe';
import { RecentActivityModule } from './libs/recent-activity/recent-activity.module';

// 环境变量文件路径
const envFilePath = `.env.${process.env.NODE_ENV}`;
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
    }),
    TypeOrmModule.forFeature([Log]),
    DatabaseModule,
    UserModule,
    BannerModule,
    ChatModule,
    ArticleModule,
    UtilsModule,
    RecentActivityModule,
  ],
  providers: [
    Logger,
    LogService,
    AppService,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatDateInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
  exports: [Logger, RedisService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 对所有路由应用自定义 Logger
    consumer.apply(LogService).forRoutes('*');
  }
}
