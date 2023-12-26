import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../graphql/models/User';
import { CreateUserInput } from '../graphql/utils/CreateUserInput';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  getUsers(): Promise<Users[]> {
    return this.usersRepository.find({ relations: ['settings'] });
  }

  getUserById(id: number): Promise<Users> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['settings'],
    });
  }

  createUser(createUserData: CreateUserInput): Promise<Users> {
    const newUser = this.usersRepository.create(createUserData);
    return this.usersRepository.save(newUser);
  }
}
