import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';
import User from '@/database/user.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
    await connectToDatabase();
    const nodeId = params.id;

    const users = await User.find(); // DO NOT REMOVE | Otherwise populating the user field will not work.
    const nodeHistory = await History.find({ node: nodeId }).populate('user');

    nodeHistory.sort((a, b) => b.timeStamp - a.timeStamp);

    return new Response(
      JSON.stringify({ nodeHistory, message: 'Sucesfully fetched the History' }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ err, message: 'Failed to fetch node' }), {
      status: 500,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
    await connectToDatabase();

    const { printTime, fileName, name } = await request.json();

    // [TO FIX] THIS CAN INTRODUCE BUGS IN CASE YOU ARE REGISTERED WITH YOUR WORK EMAIL + STUDENT EMAIL | ONE OF THEM WILL NEED TO BE DELETED
    const user = await User.findOne({ display_name: name });

    // if this is not from a printer node
    if (printTime === 'N/A') {
      const newHistory = await new History({
        user: user._id,
        node: params.id,
      }).save();
      return new Response(JSON.stringify(newHistory), { status: 201 });
    } else {
      const newHistory = await new History({
        user: user._id,
        node: params.id,
        printDuration: printTime,
        fileName,
      }).save();
      return new Response(JSON.stringify(newHistory), { status: 201 });
    }
  } catch (err) {}
}
