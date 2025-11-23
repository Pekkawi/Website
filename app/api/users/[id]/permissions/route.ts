import { auth } from '@/auth';
import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;

    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin block their request
    // if (session?.user?.role !== 'Admin')
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    const userId = params.id;
    const { permissionId } = await request.json();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        {
          status: 404,
        }
      );
    }

    if (user.permissions.includes(permissionId)) {
      user.permissions = user.permissions.filter(
        (permission: Types.ObjectId) => !permission.equals(permissionId)
      );
    } else {
      user.permissions.push(permissionId);
    }
    return NextResponse.json(await user.save(), { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { err },
      {
        status: 500,
      }
    );
  }
}
