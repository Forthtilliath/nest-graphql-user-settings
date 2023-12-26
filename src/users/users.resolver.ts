import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Users } from '../graphql/models/User';
import { CreateUserInput } from '../graphql/utils/CreateUserInput';
import { UsersService } from './users.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(@Inject(UsersService) private userService: UsersService) {}

  @Query(() => Users, { nullable: true })
  getUserById(@Args('id', { type: () => Int }) id: Users['id']) {
    return this.userService.getUserById(id);
  }

  @Query(() => [Users])
  async getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => Users)
  createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return this.userService.createUser(createUserData);
  }
}
