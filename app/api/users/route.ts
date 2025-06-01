// http:localhost:3000/api/users

import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest } from 'next/server';

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

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response('Failed to fetch Users', { status: 500 });
  }
}
