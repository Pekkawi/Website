import { auth } from '@/auth';
import UserCredentials from '@/database/usercredential.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const credId = params.id;
    await connectToDatabase(); // attempt connecting to the DB first

    await UserCredentials.where({ _id: credId }).deleteOne();

    return new Response(
      JSON.stringify({ message: 'Succesfully deleted the user credential' }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ err, message: 'Failed to delete user credential' }),
      {
        status: 500,
      }
    );
  }
}
