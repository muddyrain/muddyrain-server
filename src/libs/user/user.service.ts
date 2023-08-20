import { ResponseHelper } from '../../common/ResponseHelper.filter';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PagerQueryParams } from '@/common';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '@/constant/config';

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
      return ResponseHelper.error('user already exists');
    } else {
      const userTmp = this.userRepository.create({
        ...user,
        password: md5(user.password),
      });
      const _user = await this.userRepository.save(userTmp);
      delete _user.password;
      return ResponseHelper.success('created successfully');
    }
  }
  async findAll(params: PagerQueryParams) {
    const users = await this.userRepository.find({
      skip: (+params.page - 1) * +params.pageSize,
      take: +params.pageSize,
    });
    return ResponseHelper.success(users);
  }

  async update(user: User, id: string) {
    // 白名单禁止修改的key
    const whiteKeyList: string[] = [];
    for (const key in user) {
      if (whiteKeyList.includes(key)) {
        return ResponseHelper.error(`The ${key} no modification`);
      }
    }
    const userTmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (userTmp === null) {
      return ResponseHelper.error('the user is not exist');
    }
    if ('password' in user) {
      user.password = md5(user.password);
    }
    await this.userRepository.save({ ...userTmp, ...user });
    return ResponseHelper.success('Successfully modified');
  }

  async remove(id: string | string[]) {
    if (typeof id === 'string') {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return ResponseHelper.error('User with ID ${id} not found');
      }
      try {
        await this.userRepository.remove(user);
        return ResponseHelper.success('successfully deleted');
      } catch (error) {
        return ResponseHelper.error('User deletion failed');
      }
    }

    if (Array.isArray(id)) {
      try {
        await this.userRepository
          .createQueryBuilder()
          .delete()
          .where(`id IN (:...ids)`, { ids: id })
          .execute();
        return ResponseHelper.success('successfully deleted');
      } catch (error) {
        return ResponseHelper.error('User deletion failed');
      }
    }
    return ResponseHelper.error('The `id` is irregular parameter');
  }

  async login(body: { userName: string; password: string }) {
    const user = await this.userRepository.findOneBy({
      userName: body.userName,
    });
    if (user.password === md5(body.password)) {
      const token = jwt.sign({ ...user }, PRIVATE_KEY, {
        expiresIn: '30d',
        header: {
          typ: 'JWT',
          alg: 'HS256',
        },
      });
      return ResponseHelper.success({
        token,
        ...user,
      });
    }
    return ResponseHelper.error('Incorrect username or password');
  }
}
