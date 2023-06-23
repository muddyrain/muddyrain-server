import { Module } from '@nestjs/common';
import { DataBaseProvider } from './db.providers';

@Module({
  providers: [...DataBaseProvider],
  exports: [...DataBaseProvider],
})
export class DatabaseModule {}
