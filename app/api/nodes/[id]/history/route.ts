import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/database/user.model';
import { auth } from '@/auth';

export async function GET(request: NextRequest, props: { params: Promise<{ id: Types.ObjectId }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

export async function POST(request: NextRequest, props: { params: Promise<{ id: Types.ObjectId }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectToDatabase();

    const { printTime, fileName, name } = await request.json();
    console.log('Entering here');

    // [TO FIX] THIS CAN INTRODUCE BUGS IN CASE YOU ARE REGISTERED WITH YOUR WORK EMAIL + STUDENT EMAIL | ONE OF THEM WILL NEED TO BE DELETED
    console.log(name);
    const user = await User.findOne({ display_name: name });
    console.log('Found the user');
    // if this is not from a printer node
    if (printTime === 'N/A') {
      const newHistory = await new History({
        user: user._id,
        node: params.id,
      }).save();
      return NextResponse.json(newHistory, { status: 201 });
    } else {
      const newHistory = await new History({
        user: user._id,
        node: params.id,
        printDuration: printTime,
        fileName,
      }).save();
      // return new Response(JSON.stringify(newHistory), { status: 201 });
      return NextResponse.json(newHistory, { status: 201 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
