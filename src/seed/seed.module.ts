import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';
import { ItemsModule } from '../items/items.module';

@Module({
  providers: [SeedResolver, SeedService],

  imports: [UsersModule, ItemsModule],
})
export class SeedModule {}
