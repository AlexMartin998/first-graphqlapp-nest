import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ItemsModule],

  providers: [UsersResolver, UsersService],

  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
