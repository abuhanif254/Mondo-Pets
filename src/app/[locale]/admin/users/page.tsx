import { UsersClient } from './UsersClient';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management | Admin',
};

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pets: true
    }
  });

  return <UsersClient initialUsers={users} />;
}
