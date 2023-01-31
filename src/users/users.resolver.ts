import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetAuthenticatedUser } from '../auth/decorators';
import { ValidRoles } from '../auth/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { Item } from '../items/entities/item.entity';
import { ItemsService } from '../items/items.service';
import { ValidRolesArgs } from './dto/args';
import { UpdateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard) // authentication
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @GetAuthenticatedUser([ValidRoles.admin]) _user: User, // authorization
    @Args() validRoles: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<User[]> {
    return this.usersService.findAll(
      validRoles.roles,
      paginationArgs,
      searchArgs,
    );
  }

  @Query(() => User, { name: 'user' })
  findOneByEmail(
    @Args('email', { type: () => String }) email: string,
  ): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetAuthenticatedUser([ValidRoles.admin]) _user: User, // authorization
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetAuthenticatedUser([ValidRoles.admin]) user: User, // authorization
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetAuthenticatedUser([ValidRoles.admin]) user: User, // authorization
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' }) // no es una Qeuery, solo accesible x user
  async itemCount(
    @GetAuthenticatedUser([ValidRoles.admin]) admin: User, // authorization
    @Parent() user: User, // me dice q user estos iterando ese momento
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @GetAuthenticatedUser([ValidRoles.admin]) admin: User, // authorization
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }
}
