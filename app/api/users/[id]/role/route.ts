import { auth } from '@/auth';
import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Fixed: Promise wrapper + only 2 parameters
): Promise<Response> {
  // ✅ Fixed: Explicit return type
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    // ✅ Fixed: Await the params promise (Next.js 15 requirement)
    const { id } = await params;
    const { role } = await request.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.role = role;
    const updatedUser = await user.save();

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error('PATCH /api/users/[id]/permissions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
