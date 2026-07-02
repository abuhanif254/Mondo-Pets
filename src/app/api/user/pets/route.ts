import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, breed, age } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        breed,
        age: age ? parseInt(age) : null,
        userId: session.userId as string
      }
    });

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Add pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
