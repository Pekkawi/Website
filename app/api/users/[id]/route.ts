import { auth } from '@/auth';
import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = params.id;
    await connectToDatabase(); // attempt connecting to the DB first

    const user = await User.where({ _id: userId }).findOne();
    return new Response(
      JSON.stringify({ user, message: 'Succesfully fetched the user' }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ err, message: 'Failed to fetch user' }), {
      status: 500,
    });
  }
}

// Role based access???

// Only allow them to fetch a user

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = params.id;
    await connectToDatabase(); // attempt connecting to the DB first

    await User.where({ _id: userId }).deleteOne();

    return new Response(JSON.stringify({ message: 'Succesfully deleted the user' }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ err, message: 'Failed to delete user' }), {
      status: 500,
    });
  }
}
