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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const id = params.id;
    console.log(id);

    const data = await req.json();
    const role = data.role;

    const userCredential = await UserCredentials.findById(id);
    if (!userCredential) {
      return NextResponse.json(
        { error: "Could not find the User's Credentials" },
        { status: 404 }
      );
    }

    userCredential.role = role;

    return NextResponse.json(await userCredential.save(), { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
