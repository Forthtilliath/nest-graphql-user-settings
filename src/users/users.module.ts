import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../graphql/models/User';
import { UserSettings } from '../graphql/models/UserSetting';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSettingsService } from './user_settings.service';
import { UserSettingsResolver } from './user_settings.resolver';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserSettings])],
  controllers: [UsersController],
  providers: [
    UsersResolver,
    UsersService,
    UserSettingsService,
    UserSettingsResolver,
  ],
})
export class UsersModule {}
