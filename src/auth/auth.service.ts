import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types';
import * as bcrypt from 'bcrypt';

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

  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(
        'Hubo un problema al iniciar sesión. Comprueba tu correo electrónico y contraseña o crea una cuenta',
      );

    // create jwt
    const token = 'sometoken';

    return { jwt: token, user };
  }
}
