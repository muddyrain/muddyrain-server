import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './constant/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局前缀
  app.setGlobalPrefix(envConfig('GLOBAL_PREFIX'));
  await app.listen(envConfig('PORT'), () => {
    console.log(
      `服务启动成功 - http://127.0.0.1:${envConfig('PORT')}${envConfig(
        'GLOBAL_PREFIX',
      )}`,
    );
  });
}
bootstrap();
