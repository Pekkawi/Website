import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { baseNode } from '@/database/newnode.model';
import { auth } from '@/auth';

export async function GET(request: NextRequest, props: { params: Promise<{ id: Types.ObjectId }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectToDatabase();
    const userId = params.id;

    const nodes = await baseNode.find(); // DO NOT REMOVE | Otherwise populating the user field will not work.
    const userHistory = await History.find({ user: userId }).populate('node');

    userHistory.sort((a, b) => b.timeStamp - a.timeStamp);

    return new Response(
      JSON.stringify({ userHistory, message: 'Sucesfully fetched User History' }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ err, message: 'Failed to fetch node' }), {
      status: 500,
    });
  }
}
