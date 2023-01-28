import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsPositive()
  // @Min(0)
  quantity: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(9)
  quantityUnits?: string;
}
