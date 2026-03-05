import { NextRequest, NextResponse } from 'next/server';
import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { auth } from '@/auth';

// This route is for testing purposes ONLY
// You can make a POST request to the History of a device aka 3D printer by doing this
// Otherwise not used since the embedded devices will be updating the history instead in the iot route (folder)

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();

    // Parse the JSON body
    const { user, node, fileName, printDuration } = await request.json();

    if (!user || !node) {
      return NextResponse.json(
        { message: '`user` and `node` are required' },
        { status: 400 }
      );
    }

    // Create & save the doc
    const newHistory = await History.create({
      user,
      node,
      fileName,
      printDuration,
    });

    newHistory.save();

    return NextResponse.json(newHistory, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Failed to create history entry' },
      { status: 500 }
    );
  }
}
