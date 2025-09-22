import { auth } from '@/auth';
import UserCredentials from '@/database/usercredential.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectToDatabase();

    const usercreds = await UserCredentials.find({}, 'name email role access');

    return NextResponse.json(usercreds, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Could not fetch Users' }, { status: 500 });
  }
}
