import { ResponseHelper } from '../../common/ResponseHelper.filter';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PagerQueryParams } from '@/common';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '@/constant/config';
import { EXPIRES_IN } from '@/constant';
import {
  RecentActivity,
  RecentActivityTypeEnum,
} from '../recent-activity/recent-activity.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RecentActivity)
    public readonly recentActivityRepository: Repository<RecentActivity>,
  ) {}
  async create(user: User) {
    const target = await this.userRepository.findOne({
      where: {
        userName: user.userName,
      },
    });
    if (target) {
      return ResponseHelper.error('User already exists');
    } else {
      const userTmp = this.userRepository.create({
        ...user,
        password: md5(user.password),
      });
      const _user = await this.userRepository.save(userTmp);
      delete _user.password;
      this.createRecentActivity({
        type: RecentActivityTypeEnum.register,
        user: _user,
      } as RecentActivity);
      return ResponseHelper.success('Created successfully');
    }
  }
  async findAll(_params: PagerQueryParams) {
    const params = {
      page: 1,
      pageSize: 10,
      ..._params,
    };
    const users = await this.userRepository.find({
      skip: (+params.page - 1) * +params.pageSize,
      take: +params.pageSize,
      where: {
        isDelete: false,
      },
    });
    const total = await this.userRepository.count();
    return ResponseHelper.success({
      data: users,
      ...params,
      total,
      isFormate: true,
    });
  }

  async update(user: User, id: string) {
    // 白名单禁止修改的key
    const whiteKeyList: string[] = [];
    for (const key in user) {
      if (whiteKeyList.includes(key)) {
        return ResponseHelper.error(`The ${key} cannot be modified`);
      }
    }
    const userTmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (userTmp === null) {
      return ResponseHelper.error('this user does not exist');
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
        return ResponseHelper.error(`User with ID ${id} not found`);
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
    return ResponseHelper.error('`id` is an irregular parameter');
  }

  async login(body: { userName: string; password: string }) {
    if (!body.userName || !body.password)
      return ResponseHelper.error('Username or password cannot be empty');
    const user = await this.userRepository.findOneBy({
      userName: body.userName,
    });
    if (user && user.password === md5(body.password)) {
      const token = jwt.sign({ ...user }, PRIVATE_KEY, {
        expiresIn: EXPIRES_IN,
        header: {
          typ: 'JWT',
          alg: 'HS256',
        },
      });
      this.createRecentActivity({
        type: RecentActivityTypeEnum.login,
        user,
      } as RecentActivity);
      return ResponseHelper.success({
        token,
        ...user,
      });
    }
    return ResponseHelper.error('Username or password is incorrect');
  }

  createRecentActivity(body: RecentActivity) {
    const tmp = this.recentActivityRepository.create(body);
    return this.recentActivityRepository.save(tmp);
  }

  async detail(id: string) {
    const tmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!tmp) return ResponseHelper.error('User does not exist');
    return ResponseHelper.success(tmp);
  }
}
