import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSetting } from '../graphql/models/UserSetting';
import { CreateUserSettingInput } from '../graphql/utils/CreateUserSettingInput';
import { UserSettingService } from 'src/users/user_settings.service';

@Resolver()
export class UserSettingResolver {
  constructor(private userSettingsService: UserSettingService) {}

  @Mutation(() => UserSetting)
  createUserSetting(
    @Args('createUserSettingData')
    createUserSettingData: CreateUserSettingInput,
  ): Promise<UserSetting> {
    return this.userSettingsService.createUserSetting(createUserSettingData);
  }
}
