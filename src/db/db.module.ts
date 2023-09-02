import { envConfig } from '@/constant/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envConfig('DB_HOST'),
      port: +envConfig('DB_PORT'),
      username: envConfig('DB_USERNAME'),
      password: envConfig('DB_PASSWORD'),
      database: envConfig('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
