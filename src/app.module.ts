import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { BannerModule } from './banner/banner.module';

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
    DatabaseModule,
    UserModule,
    BannerModule,
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
