import { User } from './user.entity';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';
import prisma from '../../shared/prisma';

class UserService {
  async getAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async isUserIdExist(id: string): Promise<boolean> {
    const user = await this.getById(id);
    return !!user;
  }

  async create(data: Partial<User>): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name!,
        email: data.email!,
        password: data.password!,
        role: data.role || 'STUDENT',
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new CustomError('User not found', 'USER', HttpErrorStatus.NotFound);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new CustomError('User not found', 'USER', HttpErrorStatus.NotFound);
    }
  }
}

export const userService = new UserService();
