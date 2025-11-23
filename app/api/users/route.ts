// http:localhost:3000/api/users

import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    // if (session?.user?.role !== 'Admin')
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    const users = await User.find({}); // Fetch all the users

    // sort users alphabetically by name
    users.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1;
      } else if (a.first_name > b.first_name) {
        return 1;
      } else {
        return 0;
      }
    });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err, message: 'Failed to fetch User' },
      { status: 500 }
    );
  }
}
