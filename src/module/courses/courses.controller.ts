import { Request, Response } from 'express';
import { courseService } from './courses.service';
import { zodValidation } from '../../shared/zod.util';
import { createCourseSchema, updateCourseSchema } from './util/courses.schema';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';

class CourseController {
  async getAll(req: Request, res: Response) {
    const courses = courseService.getAll();
    res.status(200).json(courses);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) throw new CustomError('Course ID is required', 'COURSE', HttpErrorStatus.BadRequest);

    const course = courseService.getById(id);
    if (!course) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

    res.status(200).json(course);
  }

  async create(req: Request, res: Response) {
    const userId = req.session.userId!;
    const role = req.body.role; 
    const validated = zodValidation(createCourseSchema, req.body, 'COURSE');

    const course = courseService.create({ ...validated, creatorId: userId });
    res.status(201).json(course);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) throw new CustomError('Course ID is required', 'COURSE', HttpErrorStatus.BadRequest);

    const userId = req.session.userId!;
    const role = req.body.role;
    const validated = zodValidation(updateCourseSchema, req.body, 'COURSE');

    const updated = courseService.update(id, userId, validated, role);
    res.status(200).json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) throw new CustomError('Course ID is required', 'COURSE', HttpErrorStatus.BadRequest);

    const userId = req.session.userId!;
    const role = req.body.role;

    courseService.delete(id, userId, role);
    res.status(204).send();
  }
}

export const courseController = new CourseController();
