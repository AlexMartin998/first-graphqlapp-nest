import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  super = 'super',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Some description - Enums',
});
