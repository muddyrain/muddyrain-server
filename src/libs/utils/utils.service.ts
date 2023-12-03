import { ResponseHelper } from '@/common/ResponseHelper.filter';
import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class UtilsService {
  constructor(private readonly minioService: MinioService) {}
  bucketName = 'muddyrain';
  async removeFile(objectName: string) {
    try {
      const bucketName = this.bucketName;
      await this.minioService.client.removeObject(bucketName, objectName);
      return ResponseHelper.success('删除成功');
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }

  async upload(file: Express.Multer.File) {
    const metaData = {
      'Content-Type': 'image/jpeg',
    };
    try {
      const bucketName = this.bucketName;
      const objectName = Date.now() + '_' + file.originalname;
      const result = await this.minioService.client.putObject(
        bucketName,
        objectName,
        file.buffer,
        metaData,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { buffer, ..._file } = file;
      // 生成持久可访问的URL
      const url = await this.minioService.client.presignedUrl(
        'GET',
        bucketName,
        objectName,
      );
      return ResponseHelper.success({
        ...result,
        url,
        ..._file,
        objectName,
        minioInfo: {
          bucketName,
          objectName,
          url,
        },
      });
    } catch (error) {
      return ResponseHelper.error(error);
    }
  }
}
