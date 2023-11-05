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
      return ResponseHelper.error('用户已存在');
    } else {
      const userTmp = this.userRepository.create({
        ...user,
        password: md5(user.password),
      });
      const _user = await this.userRepository.save(userTmp);
      delete _user.password;
      return ResponseHelper.success('创建成功');
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
        return ResponseHelper.error(`The ${key} 不可以修改`);
      }
    }
    const userTmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (userTmp === null) {
      return ResponseHelper.error('该用户不存在');
    }
    if ('password' in user) {
      user.password = md5(user.password);
    }
    await this.userRepository.save({ ...userTmp, ...user });
    return ResponseHelper.success('修改成功');
  }

  async remove(id: string | string[]) {
    if (typeof id === 'string') {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return ResponseHelper.error(`未找到 ID 为 ${id} 的用户`);
      }
      try {
        await this.userRepository.remove(user);
        return ResponseHelper.success('删除成功');
      } catch (error) {
        return ResponseHelper.error('用户删除失败');
      }
    }

    if (Array.isArray(id)) {
      try {
        await this.userRepository
          .createQueryBuilder()
          .delete()
          .where(`id IN (:...ids)`, { ids: id })
          .execute();
        return ResponseHelper.success('删除成功');
      } catch (error) {
        return ResponseHelper.error('用户删除失败');
      }
    }
    return ResponseHelper.error('`id` 是不规则参数');
  }

  async login(body: { userName: string; password: string }) {
    if (!body.userName || !body.password)
      return ResponseHelper.error('用户名或密码错误');
    const user = await this.userRepository.findOneBy({
      userName: body.userName,
    });
    if (user && user.password === md5(body.password)) {
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
    return ResponseHelper.error('用户名或密码错误');
  }
}
