import { auth } from '@/auth';
import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } },
  response: NextResponse
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectToDatabase();
    const userId = params.id;
    const { permissionId } = await request.json();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
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
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
}
