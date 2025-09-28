import Permissions from '@/database/permission.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { Db, GridFSBucket } from 'mongodb';
// import { Readable } from 'stream';
import { Types } from 'mongoose';
import { auth } from '@/auth';
// import { decode } from 'base64-arraybuffer';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    const permissions = await Permissions.find({});

    // Add image URL to each permission
    const permissionsWithImageURL = permissions.map((perm) => {
      return {
        ...perm.toObject(),
        image: `${process.env.NEXTAUTH_URL}/api/images/${perm.image}`, // Image route for fetching
      };
    });

    return new Response(JSON.stringify(permissionsWithImageURL), { status: 200 });
  } catch (err) {
    return new Response('Failed to fetch permissions', { status: 500 });
  }
}

// Create a new permission
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const db = await connectToDatabase();
    const formData = await request.json();
    const { name, abbreviation, description, scheduling, permission, image } = formData;

    if (!(db instanceof Db)) {
      return new Response('Database connection failed', { status: 500 });
    }

    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    if (!image) {
      return new Response('No image provided', { status: 400 });
    }

    const [, base64] = image.split(',');
    const buffer = Buffer.from(base64, 'base64');
    const contentType = image.split(':')[1].split(';')[0];

    const uploadStream = bucket.openUploadStream(name, {
      chunkSizeBytes: 261120,
      contentType,
    });

    const fileId = await new Promise<Types.ObjectId>((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id);
      });
      uploadStream.end(buffer);
    });

    const newPermission = new Permissions({
      name,
      description,
      abbreviation,
      image: fileId,
      default: permission === 'default',
      scheduling,
      Workflow: 'open',
    });

    await newPermission.save();

    return new Response(
      JSON.stringify({
        message: 'Permission created successfully',
        permissionId: newPermission._id,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response('Failed to create permission', { status: 500 });
  }
}
