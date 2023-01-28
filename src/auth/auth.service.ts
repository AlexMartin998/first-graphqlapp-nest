import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupInput: SignupInput): Promise<AuthResponse> {
    // create user
    const user = await this.usersService.create(signupInput);

    // create jwt
    const token = this.getJwt(user.id);

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
    const token = this.getJwt(user.id);

    return { jwt: token, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwt(user.id);

    return { jwt: token, user };
  }

  private getJwt(id: string) {
    const token = this.jwtService.sign({ id });
    return token;
  }
}
