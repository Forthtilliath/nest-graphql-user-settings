import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSettings } from './UserSetting';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class Users {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  username: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  displayName?: string;

  @OneToOne(() => UserSettings)
  @JoinColumn()
  @Field({ nullable: true })
  settings?: UserSettings;
}
