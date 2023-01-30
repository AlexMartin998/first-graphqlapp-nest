import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(user: User): Promise<Item[]> {
    // TODO: add paging & filtering
    return this.itemsRepository.find({
      where: {
        owner: {
          id: user.id,
        },
      },
    });
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

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    // const item = await this.findOne(id);

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
}
