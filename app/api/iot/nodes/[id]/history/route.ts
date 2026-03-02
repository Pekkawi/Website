import { History } from '@/database/history.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/database/user.model';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // ### TO DO: Add Node auithentication logic so they can post their history here :D ###

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
