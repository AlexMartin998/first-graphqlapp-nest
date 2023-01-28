import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  jwt: string;

  // como pass no es un @Field() no sera accessible
  @Field(() => User)
  user: User;
}
