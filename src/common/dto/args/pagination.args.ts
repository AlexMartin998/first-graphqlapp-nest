import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { pagination } from '../../utils';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  limit?: number = pagination.limit;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  offset?: number = pagination.offset;
}
