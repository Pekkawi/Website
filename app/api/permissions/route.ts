import { PermissionFormData } from '@/components/Permissions Page/PermissionsForm';
import Permissions from '@/database/permission.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

// Get all permissions
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const perms = await Permissions.find({});

    return new Response(JSON.stringify(perms), { status: 200 });
  } catch (err) {
    return new Response('Failed to fetch permissions', { status: 500 });
  }
}

// Create a new permission
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const permission: PermissionFormData = await request.json();

    const newPermission = new Permissions({
      name: permission.name,
      abbreviation: permission.abbreviation,
      description: permission.description || '',
      scheduling: permission.scheduling,
      workflow: 'open', // This is set in the old DB model as "open for all devices"
      default: permission.permission === 'default_permission',
      image: new Types.ObjectId(), // You'll need to handle image upload separately
    });

    await newPermission.save();

    return new Response(
      JSON.stringify({
        message: 'Permission created successfully',
        permission: newPermission,
      }),
      { status: 201 }
    );
  } catch (err) {
    return new Response('Failed to create permission', { status: 500 });
  }
}
