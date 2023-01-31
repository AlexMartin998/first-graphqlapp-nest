import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignupInput } from '../auth/dto/inputs';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ValidRoles } from '../auth/enums';
import { UpdateUserInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    // // Sin paging ni searching
    // if (roles.length === 0) return await this.userRepository.find();
    // if (roles.length === 0)  // no necesario x el lazy
    // return this.userRepository.find({ relations: { lastUdateBy: true } });

    // paging
    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    // with roles
    if (roles.length !== 0)
      queryBuilder
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles);

    // searching
    if (search)
      queryBuilder.andWhere(`LOWER("full_name") like :name`, {
        name: `%${search.toLowerCase()}%`,
      });

    return queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
      // this.handleDBErrors({
      //   code: 'err-001',
      //   detail: `Email '${email}' not found`,
      // });
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID '${id}' not found`);

    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserInput,
    });
    if (!user) throw new NotFoundException(`User with id '${id} not found`);
    user.lastUdateBy = adminUser;
    if (updateUserInput.password)
      user.password = bcrypt.hashSync(updateUserInput.password, 10);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOne(id);
    if (!userToBlock.isActive)
      throw new BadRequestException('User already blocked');

    userToBlock.isActive = false;
    userToBlock.lastUdateBy = adminUser;

    return await this.userRepository.save(userToBlock);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'err-001') throw new NotFoundException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
