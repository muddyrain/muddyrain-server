import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './libs/user/user.module';
import { BannerModule } from './libs/banner/banner.module';
import { LogService } from './libs/log/log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './libs/log/log.entity';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FormatDateInterceptor } from './Interceptors/FormatDateInterceptor';

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
  ],
  providers: [
    Logger,
    LogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatDateInterceptor,
    },
  ],
  exports: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*'); // 替换为您需要保护的路由
    // 对所有路由应用自定义 Logger
    consumer.apply(LogService).forRoutes('*');
  }
}
