import { NextRequest, NextResponse } from 'next/server';
import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';

export async function POST(request: NextRequest) {
  try {
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
