import { getContactMessages } from '@/app/actions/contact';
import { MessagesClient } from './MessagesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Messages | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="max-w-5xl mx-auto">
      <MessagesClient initialMessages={messages} />
    </div>
  );
}
