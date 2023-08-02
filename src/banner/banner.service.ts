import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Banner } from './banner.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    public readonly bannerRepository: Repository<Banner>,
  ) {}
  create(body: Banner) {
    const tmp = this.bannerRepository.create(body);
    return this.bannerRepository.save(tmp);
  }
}
