import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UtilsService } from './utils.service';

@Controller('utils')
export class UtilsController {
  constructor(private readonly templateService: UtilsService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.templateService.upload(file);
  }

  @Delete('/upload/:objectName')
  async removeFile(@Param('objectName') objectName: string) {
    return this.templateService.removeFile(objectName);
  }
}
