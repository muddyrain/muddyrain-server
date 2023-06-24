import { Module } from '@nestjs/common';
import { DataBaseProvider } from './db.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
console.log(DataBaseProvider[0]);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mm001030',
      database: 'muddyrain',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
