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
import { UserModule } from './user/user.module';
import { BannerModule } from './banner/banner.module';
import { LogService } from './log/log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log/log.entity';

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
  providers: [Logger, LogService],
  exports: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 对所有路由应用自定义 Logger
    consumer.apply(LogService).forRoutes('*');
  }
}
