import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/database/user.model';
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

    // If the user who is logged in is not an admin Deny their request
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    const nodeId = params.id;
    const users = await User.find(); // DO NOT REMOVE | Otherwise populating the user field will not work.
    const nodeHistory = await History.find({ node: nodeId }).populate('user');

    nodeHistory.sort((a, b) => b.timeStamp - a.timeStamp);

    return NextResponse.json(
      { nodeHistory, message: 'Sucesfully fetched the History' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err, message: 'Failed to fetch node' },
      { status: 500 }
    );
  }
}
