import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signupInput: SignupInput): Promise<AuthResponse> {
    // create user
    const user = await this.usersService.create(signupInput);

    // create jwt
    const token = 'adlnASDNO12';

    return {
      jwt: token,
      user,
    };
  }
}
