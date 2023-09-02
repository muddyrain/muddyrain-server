import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { MinioModule } from 'nestjs-minio-client';
import { envConfig } from '@/constant/config';

@Module({
  imports: [
    MinioModule.register({
      endPoint: envConfig('MINIO_HOST'),
      port: +envConfig('MINIO_PORT'),
      useSSL: !!+envConfig('MINIO_USE_SSL'),
      accessKey: envConfig('MINIO_AK'),
      secretKey: envConfig('MINIO_SK'),
    }),
  ],
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
