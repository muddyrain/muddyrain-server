import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Picture } from './picture.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(Picture)
    public readonly pictureRepository: Repository<Picture>,
  ) {}
  create(body: Picture) {
    const tmp = this.pictureRepository.create(body);
    return this.pictureRepository.save(tmp);
  }
}
