import { envConfig } from '@/constant/config';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: envConfig('REDIS_HOST'),
      port: Number(envConfig('REDIS_PORT')),
      password: envConfig('REDIS_PASSWORD'),
    });
  }

  async setCache(key: string, value: any, seconds = -1): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
    await this.redis.expire(key, seconds);
  }

  async getCache(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return JSON.parse(value);
  }
}
