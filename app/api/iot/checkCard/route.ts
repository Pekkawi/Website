import User from '@/database/user.model';
// Ensure the permissions model is imported to register it with Mongoose.

import { connectToDatabase } from '@/lib/mongoose';
import Permissions from '@/database/permission.model';
import { IPerm } from '@/interfaces/database.interfaces';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url); // create  a new URL object from the request URL
  const cardId = url.searchParams.get('cardId'); // get the cardId query parameter from the URL

  try {
    // Establish a connection to the database.

    await connectToDatabase();

    /*

    # #  ADD: WAY TO AUTHENTICATE NODES WHICH BYPASSES THE NORMAL ROUTE VERIFICATION # #

    */

    // Attempt to find a user by card_id and populate their permissions.
    const user = await User.findOne({ card_id: cardId }).populate('permissions');
    const some = await Permissions.find({}); // This is just a temporary workaround since Permissions is not specified anywhere else in the code,
    console.log(`Person with cardID: ${cardId} (Searching now....)`);

    if (!user) {
      console.log(`Person with cardID: ${cardId} does not exist`);
      // If no user is found, return a 404 response.
      return NextResponse.json('User not found', { status: 404 });
    }

    // Checks if the user has the "LAS" permission.
    const hasLASPermission: boolean = user.permissions.some(
      (permission: IPerm) => permission.abbreviation === 'LAS'
    );

    // Checks if the user has the "FDM" permission.
    const hasFDMPermission: boolean = user.permissions.some(
      (permission: IPerm) => permission.abbreviation === 'FDM'
    );

    console.log(`Checking if user with cardID: ${cardId} has neccesary permissions`);
    // Construct and return the response with user details and permissions.
    // this logic needs to fucking change too
    return NextResponse.json(
      {
        display_name: user.display_name,
        role: user.role,
        LASPermission: hasLASPermission,
        FDMPermission: hasFDMPermission,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    // Log the error for debugging purposes.
    console.error(err);
    // Return a 500 response in case of any errors.
    return NextResponse.json('Failed to fetch user', { status: 500 });
  }
}
