import { Injectable, NestMiddleware } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request } from 'express';

@Injectable()
export class LogService implements NestMiddleware {
  constructor(
    @InjectRepository(Log)
    public readonly logRepository: Repository<Log>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { ip, originalUrl } = req;
    const log = new Log();
    log.ip = ip;
    log.url = originalUrl;
    log.message = '';
    log.username = '';
    try {
      await this.logRepository.save(log);
    } catch (error) {
      console.error('Error saving log to the database:', error);
    }
    next();
  }
}
