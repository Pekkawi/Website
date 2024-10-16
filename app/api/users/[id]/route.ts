import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
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
