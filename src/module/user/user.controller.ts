import { Request, Response } from 'express';
import { userService } from './user.service';
import { zodValidation } from '../../shared/zod.util';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';
import { createCoachSchema, updateUserSchema } from './util/user.schema';

class UserController {
  async getMe(req: Request, res: Response) {
    const userId = req.session.userId;
    if (!userId) throw new CustomError('Unauthorized', 'USER', HttpErrorStatus.Unauthorized);

    const user = userService.getById(userId);
    res.status(200).json({ ...user, password: undefined });
  }

  async updateMe(req: Request, res: Response) {
    const userId = req.session.userId;
    if (!userId) throw new CustomError('Unauthorized', 'USER', HttpErrorStatus.Unauthorized);

    const validated = zodValidation(updateUserSchema, req.body, 'USER');
    const updated = userService.update(userId, validated);
    res.status(200).json({ ...updated, password: undefined });
  }

  async createCoach(req: Request, res: Response) {
    const validated = zodValidation(createCoachSchema, req.body, 'USER');

    const existing = userService.getByEmail(validated.email);
    if (existing) throw new CustomError('Email exists', 'USER', HttpErrorStatus.Conflict);

    const coach = userService.create({ ...validated, role: 'COACH' });
    res.status(201).json({ ...coach, password: undefined });
  }
}

export const userController = new UserController();
