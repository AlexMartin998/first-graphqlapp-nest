import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,

    private readonly configService: ConfigService,
  ) {
    this.isProd = configService.get<string>('state') === 'prod';
  }

  async executeSeed() {
    if (this.isProd)
      throw new UnauthorizedException('We cannot run SEED in Prod');

    // clean db
    await this.deleteData();

    // create users
    const [admin, user, superUser] = await this.insertUsers();

    // create items
    await this.insertItems(admin, user, superUser);

    return true;
  }

  private async deleteData() {
    // items
    const itemQueryBuilder = this.itemRepository.createQueryBuilder();
    await itemQueryBuilder.delete().where({}).execute();

    // users
    const userQueryBuilder = this.userRepository.createQueryBuilder();
    await userQueryBuilder.delete().where({}).execute();
  }

  private async insertUsers(): Promise<User[]> {
    const users: User[] = [];

    SEED_USERS.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);

      users.push(this.userRepository.create(user));
    });

    return await this.userRepository.save(users);
  }

  private async insertItems(admin: User, user: User, superUser: User) {
    const insertPromises = [];

    SEED_ITEMS.forEach((item, i) => {
      if (i <= 21)
        insertPromises.push(
          this.itemRepository.create({ ...item, owner: admin }),
        );
      else if (i <= 66)
        insertPromises.push(
          this.itemRepository.create({ ...item, owner: user }),
        );
      else
        insertPromises.push(
          this.itemRepository.create({ ...item, owner: superUser }),
        );
    });

    await this.itemRepository.save(insertPromises);
  }
}
