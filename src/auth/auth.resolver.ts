import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs';
import { AuthResponse } from './types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  signUp(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signUp(signupInput);
  }

  // @Mutation({ name: 'login' })
  // login(/*  */): Promise</*  */> {
  //   return this.authService.login();
  // }

  // @Query(/*  */ { name: 'revalidate' })
  // revalidateToken() {
  //   return this.authService.revalidateToken(/*  */);
  // }
}
