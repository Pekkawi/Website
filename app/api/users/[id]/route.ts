import { auth } from '@/auth';
import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: String }> }
) {
  const params = await props.params;
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    // if (session?.user?.role !== 'Admin')
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const userId = params.id;
    await connectToDatabase(); // attempt connecting to the DB first

    const user = await User.where({ display_name: userId })
      .findOne()
      .select('display_name email card_id card_number role permissions');
    return NextResponse.json(
      { user, message: 'Succesfully fetched the user' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { err, message: 'Failed to fetch user' },
      {
        status: 500,
      }
    );
  }
}

// Role based access???

// Only allow them to fetch a user

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const userId = params.id;
    await connectToDatabase(); // attempt connecting to the DB first

    await User.where({ _id: userId }).deleteOne();

    return NextResponse.json(
      { message: 'Succesfully deleted the user' },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      { err, message: 'Failed to delete user' },
      {
        status: 500,
      }
    );
  }
}
