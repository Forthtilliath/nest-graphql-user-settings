import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSettings } from '../graphql/models/UserSetting';
import { CreateUserSettingsInput } from '../graphql/utils/CreateUserSettingInput';
import { UserSettingsService } from './user_settings.service';

@Resolver()
export class UserSettingsResolver {
  constructor(private userSettingsService: UserSettingsService) {}

  @Mutation(() => UserSettings)
  createUserSetting(
    @Args('createUserSettingData')
    createUserSettingsData: CreateUserSettingsInput,
  ): Promise<UserSettings> {
    return this.userSettingsService.createUserSetting(createUserSettingsData);
  }
}
