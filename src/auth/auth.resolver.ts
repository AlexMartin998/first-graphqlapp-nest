import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation({ name: 'signup' })
  signUp(/*  */): Promise</*  */> {
    return this.authService.signUp();
  }

  @Mutation({ name: 'login' })
  login(/*  */): Promise</*  */> {
    return this.authService.login();
  }

  @Query(/*  */ { name: 'revalidate' })
  revalidateToken() {
    return this.authService.revalidateToken(/*  */);
  }
}
