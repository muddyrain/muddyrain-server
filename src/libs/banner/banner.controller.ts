import { Body, Controller, Post } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}
  @Post()
  create(@Body() body) {
    return this.bannerService.create(body);
  }
}
