import { User } from '../../user/user.entity';

export type LoginDTO = {
  email: string;
  password: string;};

export type LoginResponseDTOWithJWT = {
  data: Omit<User, 'password'>;
  token: string;};

export type RegisterDTO = Pick<User, 'name' | 'email' | 'password' | 'role'>;

export type RegisterResponseDTO = Omit<User, 'password'>;