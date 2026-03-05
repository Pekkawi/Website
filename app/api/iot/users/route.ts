import User from '@/database/user.model';
import { requireAnyIotBearer } from '@/lib/iotAuth';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAnyIotBearer(request as any, ['API_KEY_LASER']);
    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.msg },
        { status: auth.status, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    await connectToDatabase();
    const users = await User.find({}, { card_id: 1, permissions: 1, _id: 0 }).lean();

    return NextResponse.json(users, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
