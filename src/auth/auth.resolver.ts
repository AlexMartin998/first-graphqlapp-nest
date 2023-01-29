import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetAuthenticatedUser } from './decorators';
import { SignupInput } from './dto/inputs';
import { LoginInput } from './dto/inputs/login.input';
import { JwtAuthGuard } from './guards';
import { AuthResponse } from './types';

@Resolver(() => AuthResolver)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  signUp(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signUp(signupInput);
  }

  @Mutation(() => AuthResponse)
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @GetAuthenticatedUser(/* [ValidRoles.admin] */) user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
