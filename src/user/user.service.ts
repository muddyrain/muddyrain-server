import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(user: User) {
    const target = await this.userRepository.findOne({
      where: {
        userName: user.userName,
      },
    });
    if (target) {
      throw new Error('用户名已存在');
    } else {
      const userTmp = this.userRepository.create(user);
      return this.userRepository.save(userTmp);
    }
  }
}
