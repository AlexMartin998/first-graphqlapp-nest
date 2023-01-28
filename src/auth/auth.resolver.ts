import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs';
import { LoginInput } from './dto/inputs/login.input';
import { JwtAuthGuard } from './guards';
import { AuthResponse } from './types';

@Resolver()
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
    // @CurrentUser user: User
  ): Promise<AuthResponse> {
    // return this.authService.revalidateToken();
    throw new Error('NO implementado');
  }
}
