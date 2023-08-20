import { Body, Controller, Post } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @Post()
  create(@Body() body) {
    return this.templateService.create(body);
  }
}
