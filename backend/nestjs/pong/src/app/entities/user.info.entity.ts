import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'oauth_provider_id', unique: true })
  oAuthProviderId: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({ name: 'is_two_factor_authentication_enabled', default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ name: 'two_factor_authentication_secret', nullable: true })
  twoFactorAuthenticationSecret: string;

  @Column({ nullable: true })
  avatar: string;
}
