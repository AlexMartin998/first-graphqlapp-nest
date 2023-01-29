import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'full_name' })
  @Field()
  fullName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  // @Field() // no queremos q sea 1 field q pueden consultar
  password: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String])
  roles: string[];

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @Field()
  isActive: boolean;

  // TODO: relations
  // // @ManyToOne()  a la misma tabla
  @ManyToOne(() => User, (user) => user.lastUdateBy, {
    nullable: true,
    lazy: true, // trnasforma en una promise - no eager xq es la misma tb
  })
  @JoinColumn({ name: 'last_update_by_user_id' })
  @Field(() => User, { nullable: true })
  lastUdateBy?: User;
}
