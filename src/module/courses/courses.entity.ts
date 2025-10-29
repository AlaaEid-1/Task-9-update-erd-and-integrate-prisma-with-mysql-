export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'COACH' | 'STUDENT';
  };
}
