import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { CreateUserSettingInput } from 'src/graphql/utils/CreateUserSettingInput';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private userSettingsRepository: Repository<UserSetting>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUserSettingById(userId: number): Promise<UserSetting> {
    return this.userSettingsRepository.findOneBy({ userId });
  }

  async createUserSetting(
    createUserSettingData: CreateUserSettingInput,
  ): Promise<UserSetting> {
    const userFound = await this.userRepository.findOneBy({
      id: createUserSettingData.userId,
    });
    if (!userFound) throw new Error('User not found');

    const newUserSetting = this.userSettingsRepository.create(
      createUserSettingData,
    );
    const savedSettings =
      await this.userSettingsRepository.save(newUserSetting);
    userFound.settings = savedSettings;

    await this.userRepository.save(userFound);

    return savedSettings;
  }
}
