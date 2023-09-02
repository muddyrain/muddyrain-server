import { ResponseHelper } from '@/common/ResponseHelper.filter';
import { envConfig } from '@/constant/config';
import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class UtilsService {
  constructor(private readonly minioService: MinioService) {}

  async upload(file: Express.Multer.File) {
    const metaData = {
      'Content-Type': 'image/jpeg',
    };
    try {
      const bucketName = 'mcit';
      const objectName = Date.now() + '_' + file.originalname;
      const result = await this.minioService.client.putObject(
        bucketName,
        objectName,
        file.buffer,
        metaData,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { buffer, ..._file } = file;
      return ResponseHelper.success({
        ...result,
        url: this.constructObjectUrl(bucketName, objectName),
        ..._file,
      });
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }
  private constructObjectUrl(bucketName: string, objectName: string): string {
    return `http://${envConfig('MINIO_HOST')}:${envConfig(
      'MINIO_PORT',
    )}/${bucketName}/${objectName}`;
  }
}
