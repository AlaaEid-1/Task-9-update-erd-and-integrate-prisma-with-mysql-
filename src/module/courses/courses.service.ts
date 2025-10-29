import { Course } from './courses.entity';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';
import prisma from '../../shared/prisma';

class CourseService {
  async getAll(): Promise<Course[]> {
    return prisma.course.findMany({
      include: { creator: true },
    });
  }

  async getById(id: string): Promise<Course | null> {
    return prisma.course.findUnique({
      where: { id },
      include: { creator: true },
    });
  }

  async create(course: Partial<Course>): Promise<Course> {
    // تحقق من الحقول المطلوبة
    if (!course.title || !course.description || !course.creatorId) {
      throw new CustomError(
        'Missing required fields',
        'COURSE',
        HttpErrorStatus.BadRequest
      );
    }

    return prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        image: course.image || null,
        creatorId: course.creatorId,
      },
      include: { creator: true },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Course>,
    role: 'ADMIN' | 'COACH' | 'STUDENT'
  ): Promise<Course> {
    const course = await this.getById(id);
    if (!course) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

    if (role !== 'ADMIN' && course.creatorId !== userId) {
      throw new CustomError('Forbidden', 'COURSE', HttpErrorStatus.Forbidden);
    }

    try {
      const updateData: any = { ...data };
      delete updateData.creator; // Remove creator from update data as it's not updatable
      return await prisma.course.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: { creator: true },
      });
    } catch (error) {
      throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);
    }
  }

  async delete(
    id: string,
    userId: string,
    role: 'ADMIN' | 'COACH' | 'STUDENT'
  ): Promise<void> {
    const course = await this.getById(id);
    if (!course) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

    if (role !== 'ADMIN' && course.creatorId !== userId) {
      throw new CustomError('Forbidden', 'COURSE', HttpErrorStatus.Forbidden);
    }

    try {
      await prisma.course.delete({ where: { id } });
    } catch (error) {
      throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);
    }
  }
}

export const courseService = new CourseService();
