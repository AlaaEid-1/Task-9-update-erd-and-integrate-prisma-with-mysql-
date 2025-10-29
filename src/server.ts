import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { PORT, SESSION_SECRET } from './config/app.config';
import { handleError } from './shared/exception';
import authRoutes from './module/auth/auth.routes';
import userRoutes from './module/user/user.routes';
import courseRoutes from './module/courses/courses.routes';

const app = express();
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).send('Route not found');
});
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  handleError(err, res);
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
