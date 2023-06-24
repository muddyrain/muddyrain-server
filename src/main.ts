import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './constant/config';
import { HttpExceptionFilter } from './common/httpException.filter';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });
  // 设置全局前缀
  app.setGlobalPrefix(envConfig('GLOBAL_PREFIX'));
  // 设置全局http异常过滤
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  await app.listen(envConfig('PORT'), () => {
    console.log(
      `服务启动成功 - http://127.0.0.1:${envConfig('PORT')}${envConfig(
        'GLOBAL_PREFIX',
      )}`,
    );
  });
}
bootstrap();
