import { PrismaClient } from '@prisma/client';
import { createArgonHash } from '../src/module/auth/util/argon.util';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await createArgonHash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const coachPassword = await createArgonHash('coach123');
  const coach = await prisma.user.upsert({
    where: { email: 'coach@gmail.com' },
    update: {},
    create: {
      name: 'Coach User',
      email: 'coach@gmail.com',
      password: coachPassword,
      role: 'COACH',
    },
  });

  const studentPassword = await createArgonHash('student123');
  const student = await prisma.user.upsert({
    where: { email: 'student@gmail.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@gmail.com',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'Introduction to Node.js',
      description: 'Learn the basics of Node.js development',
      creatorId: coach.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      title: 'Advanced TypeScript',
      description: 'Master advanced TypeScript concepts',
      creatorId: coach.id,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-3' },
    update: {},
    create: {
      id: 'course-3',
      title: 'Database Design',
      description: 'Learn how to design efficient databases',
      creatorId: admin.id,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Created users:', { admin: admin.email, coach: coach.email, student: student.email });
  console.log('Created courses:', { course1: course1.title, course2: course2.title, course3: course3.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
