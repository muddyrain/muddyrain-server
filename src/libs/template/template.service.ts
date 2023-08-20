import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    public readonly templateRepository: Repository<Template>,
  ) {}
  create(body: Template) {
    const tmp = this.templateRepository.create(body);
    return this.templateRepository.save(tmp);
  }
}
