import { getAuthors } from '@/app/actions/authors';
import { AuthorClient } from './AuthorClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Authors | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return <AuthorClient initialAuthors={authors} />;
}
