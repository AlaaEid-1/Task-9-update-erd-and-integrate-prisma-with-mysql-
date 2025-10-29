import { Request, Response } from 'express';
import { authService } from './auth.service';
import { generateJWT } from './util/jwt.util';

class AuthController {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);

    return res.status(201).json({
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  }
}

export const authController = new AuthController();
