import { NextFunction, Request, Response } from 'express';
import { userService } from '../module/user/user.service';
import { CustomError } from './exception';
import { HttpErrorStatus } from './util.types';
import { verifyJWT } from '../module/auth/util/jwt.util';

export const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  if (req.session?.userId) {
    const userExists = userService.isUserIdExist(req.session.userId);
    if (userExists) {
      console.log('User authenticated via session:', req.session.userId);
      return next();
    } else {
      console.log('Session userId not found in database:', req.session.userId);
    }
  } else {
    console.log('No session found');
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token);

    try {
      const payload = verifyJWT(token) as any; 
      (req.session as any).userId = payload.userId || payload.sub; 
      (req.session as any).role = payload.role; 
      console.log('User authenticated via JWT:', (req.session as any).userId);
      return next();
    } catch (error) {
      console.log('JWT is invalid or expired');
    }
  } else {
    console.log('No Authorization header found');
  }

  return next(
    new CustomError(
      'User is not authenticated',
      'AUTH',
      HttpErrorStatus.Unauthorized
    )
  );
};

export const authorizeRoles = (...roles: ('ADMIN' | 'COACH' | 'STUDENT')[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userId = (req.session as any).userId;
    const userRole = (req.session as any).role;

    if (!userId) {
      return next(
        new CustomError(
          'User is not authenticated',
          'AUTH',
          HttpErrorStatus.Unauthorized
        )
      );
    }

    const user = userService.getById(userId);
    if (!user || !roles.includes(userRole)) {
      console.log(`User role insufficient: ${userRole} required:`, roles);
      return next(
        new CustomError(
          'Forbidden: insufficient role',
          'AUTH',
          HttpErrorStatus.Forbidden
        )
      );
    }

    console.log('User authorized with role:', userRole);
    next();
  };
};
