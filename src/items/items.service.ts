import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { User } from '../users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({
      ...createItemInput,
      owner: user,
    });

    return await this.itemsRepository.save(newItem);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    // paging and searching
    const queryBuilder = this.itemsRepository
      .createQueryBuilder('item')
      .take(limit)
      .skip(offset)
      .where(`"user_id" =:userId`, { userId: user.id });

    if (search)
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });

    return queryBuilder.getMany();

    /*     return this.itemsRepository.find({
      take: limit,
      skip: offset,
      where: { owner: { id: user.id }, name: Like(`&${search}&`) },
    }); */
  }

  async findOne(id: string, user: User): Promise<Item> {
    // const item = await this.itemsRepository.findOne({
    //   where: { id, owner: { id: user.id } },
    // });
    const item = await this.itemsRepository.findOneBy({
      id,
      owner: { id: user.id },
    });
    if (!item) throw new NotFoundException(`Item with id: '${id}' not found`);

    // item.owner = user; // o desde la db: lazy=true

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user); // validaciones

    // si no vienen algunos campos, no los va a modificar
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with id: '${id}' not found`);

    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    // TODO: soft delete

    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);

    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        owner: {
          id: user.id,
        },
      },
    });
  }
}
