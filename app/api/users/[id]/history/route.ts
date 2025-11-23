import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { baseNode } from '@/database/newnode.model';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin block their request
    // if (session?.user?.role !== 'Admin')
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    const userId = params.id;

    const nodes = await baseNode.find(); // DO NOT REMOVE | Otherwise populating the user field will not work.
    const userHistory = await History.find({ user: userId }).populate('node');

    userHistory.sort((a, b) => b.timeStamp - a.timeStamp);

    return NextResponse.json(
      { userHistory, message: 'Sucesfully fetched User History' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { err, message: 'Failed to fetch node' },
      {
        status: 500,
      }
    );
  }
}
