import { Body, Controller, Post } from '@nestjs/common';
import { PictureService } from './picture.service';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}
  @Post()
  create(@Body() body) {
    return this.pictureService.create(body);
  }
}
