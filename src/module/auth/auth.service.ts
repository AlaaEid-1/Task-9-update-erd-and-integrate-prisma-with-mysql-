import { userService } from '../user/user.service';
import { RegisterDTO, LoginDTO, LoginResponseDTOWithJWT } from './types/auth.dto';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';
import { createArgonHash, verifyArgonHash } from './util/argon.util';
import { generateJWT } from './util/jwt.util';

class AuthService {
  async register(data: RegisterDTO) {
    const existingUser = await userService.getByEmail(data.email);
    if (existingUser) {
      throw new CustomError('Email already exists', 'AUTH', HttpErrorStatus.Conflict);
    }

    const hashedPassword = await createArgonHash(data.password);
    const user = await userService.create({ ...data, password: hashedPassword });
    const { password, ...rest } = user;
    return rest;
  }

  async login(data: LoginDTO): Promise<LoginResponseDTOWithJWT> {
    const user = await userService.getByEmail(data.email);
    if (!user) {
      throw new CustomError('User not found', 'AUTH', HttpErrorStatus.NotFound);
    }

    const valid = await verifyArgonHash(data.password, user.password);
    if (!valid) {
      throw new CustomError('Invalid password', 'AUTH', HttpErrorStatus.Unauthorized);
    }

    const token = generateJWT({ userId: user.id, role: user.role });
    const { password, ...userData } = user;
    return { data: userData, token };
  }
}

export const authService = new AuthService();
