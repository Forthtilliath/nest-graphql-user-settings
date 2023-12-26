import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../graphql/models/User';
import { UserSettings } from '../graphql/models/UserSetting';
import { CreateUserSettingsInput } from '../graphql/utils/CreateUserSettingInput';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  getUserSettingById(userId: number): Promise<UserSettings> {
    return this.userSettingsRepository.findOneBy({ userId });
  }

  async createUserSetting(
    createUserSettingData: CreateUserSettingsInput,
  ): Promise<UserSettings> {
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
