import { ResponseHelper } from './../common/ResponseHelper.filter';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PagerQueryParams } from '@/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private logger: Logger,
  ) {}
  async create(user: User) {
    const target = await this.userRepository.findOne({
      where: {
        userName: user.userName,
      },
    });
    if (target) {
      this.logger.error('用户已存在');
      return ResponseHelper.error('用户已存在');
    } else {
      const userTmp = this.userRepository.create(user);
      return this.userRepository.save(userTmp);
    }
  }
  async findAll(params: PagerQueryParams) {
    const users = await this.userRepository.find({
      skip: (+params.page - 1) * +params.pageSize,
      take: +params.pageSize,
    });
    return users;
  }
}
