import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../graphql/models/User';
import { UserSetting } from '../graphql/models/UserSetting';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';
import { UserSettingService } from './user_settings.service';
import { UserSettingResolver } from './user_settings.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting])],
  providers: [
    UserResolver,
    UserService,
    UserSettingService,
    UserSettingResolver,
  ],
})
export class UsersModule {}
