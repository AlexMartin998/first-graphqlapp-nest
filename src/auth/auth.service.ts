import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response';
import { SignupInput } from './dto/inputs/signup.input';

@Injectable()
export class AuthService {
  async signUp(signupInput: SignupInput): Promise<AuthResponse> {
    return;
  }
}
