import { Args, Int, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOneByEmail(
    @Args('email', { type: () => String }) email: string,
  ): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }
  // @Query(() => User, { name: 'user' })
  // findOne(
  //   @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  // ): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.block(id);
  }
}
