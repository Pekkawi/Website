import { auth } from '@/auth';
import UserCredentials from '@/database/usercredential.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    // if (session?.user?.role !== 'Admin')
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    const id = params.id;

    const data = await req.json();
    const access = data.access;

    const userCredential = await UserCredentials.findById(id);
    if (!userCredential) {
      return NextResponse.json(
        { error: "Could not find the User's Credentials" },
        { status: 404 }
      );
    }

    userCredential.access = access;

    return NextResponse.json(await userCredential.save(), { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
