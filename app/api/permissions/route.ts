import Permissions from '@/database/permission.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest } from 'next/server';
import { Db, GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { Types } from 'mongoose';
import { decode } from 'base64-arraybuffer';

// Get all permissions
/* export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();

    if (db instanceof Db) {
      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      const perms = await Permissions.find({});

      const permissionImages = [];

      for (let i = 0; i < perms.length; i++) {
        const image = await bucket.openDownloadStream(perms[i].image);
        const buffer = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Uint8Array[] = [];
          image.on('data', (chunk) => chunks.push(chunk));
          image.on('error', reject);
          image.on('end', () => resolve(Buffer.concat(chunks)));
        });

        const base64Data = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        permissionImages.push(base64Data);
      }

      perms.forEach((perm, index) => {
        perm.image = permissionImages[index];
        console.log(perm.name);
      });

      return new Response(JSON.stringify(perms), { status: 200 });
    } else {
      return new Response('Failed to fetch permissions', { status: 500 });
    }
  } catch (err) {
    return new Response('Failed to fetch permissions', { status: 500 });
  }
} */

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const permissions = await Permissions.find({});

    return new Response(JSON.stringify(permissions), { status: 200 });
  } catch (err) {
    return new Response('Failed to fetch permissions', { status: 500 });
  }
}

// Create a new permission
export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const formData = await request.json();
    const { name, abbreviation, description, scheduling, permission, image } = formData;

    if (db instanceof Db) {
      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      if (image) {
        const base64 = image.split(',')[1]; // extract the base64 string

        const buffer = decode(base64);
        const readableStream = Readable.from(Buffer.from(buffer));

        const uploadStream = bucket.openUploadStream(`${name}`, {
          chunkSizeBytes: 261120,
          contentType: image.type,
        });

        readableStream.pipe(uploadStream);

        const fileId = await new Promise<Types.ObjectId>((resolve, reject) => {
          uploadStream.on('finish', () => resolve(uploadStream.id));
          uploadStream.on('error', reject);
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
            permission: newPermission,
          }),
          { status: 201 }
        );
      }
    }

    return new Response('Failed to create permission', { status: 500 });
  } catch (err) {
    console.error(err);
    return new Response('Failed to create permission', { status: 500 });
  }
}
