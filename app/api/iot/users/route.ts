import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
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
