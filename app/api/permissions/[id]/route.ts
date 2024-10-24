import Permissions from '@/database/permission.model';
import { connectToDatabase } from '@/lib/mongoose';
import { Db, GridFSBucket } from 'mongodb';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
    const permId = params.id;
    const db = await connectToDatabase(); // attempt connecting to the DB first
    if (db instanceof Db) {
      const bucket = new GridFSBucket(db, { bucketName: 'images' }); // create a GridFs bucket
      const perm = await Permissions.findOne({ _id: permId });
      const fileId = perm.image;
      console.log(perm);
      console.log(fileId);
      await bucket.delete(fileId); // delete an image from the GridFS bucket (chunkcs and files collection)
      await Permissions.findOneAndDelete({ _id: permId }); // delete the permission

      return new Response(JSON.stringify({ message: 'Succesfully deleted the user' }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to delete permission' }), {
        status: 500,
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ err, message: 'Failed to delete permission' }), {
      status: 500,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: Types.ObjectId } }
) {
  try {
    const permId = params.id;
    const db = await connectToDatabase();
    const formData = await request.json();
    if (db instanceof Db) {
      const { name, abbreviation, description, scheduling, permission, image } = formData;
      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      const perm = await Permissions.findOne({ _id: permId });
      if (!perm) {
        return new Response('Permission not found', { status: 404 });
      }

      let fileId = perm.image; // Default to existing image

      // Check if we need to process a new image
      if (image && !image.includes('api')) {
        // Delete old image if it exists
        if (perm.image) {
          try {
            await bucket.delete(perm.image);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        // If image is a blob/file
        if (image instanceof Blob) {
          // Convert blob to base64
          const arrayBuffer = await image.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = image.type;

          const uploadStream = bucket.openUploadStream(name, {
            chunkSizeBytes: 261120,
            contentType,
          });

          const buffer = Buffer.from(base64, 'base64');
          fileId = await new Promise<Types.ObjectId>((resolve, reject) => {
            uploadStream.end(buffer, (error) => {
              if (error) reject(error);
              else resolve(uploadStream.id);
            });
          });
        } else if (typeof image === 'string' && image.includes('base64')) {
          // If image is already base64
          const [, base64] = image.split(',');
          const contentType = image.split(':')[1].split(';')[0];

          const uploadStream = bucket.openUploadStream(name, {
            chunkSizeBytes: 261120,
            contentType,
          });

          const buffer = Buffer.from(base64, 'base64');
          fileId = await new Promise<Types.ObjectId>((resolve, reject) => {
            uploadStream.end(buffer, (error) => {
              if (error) reject(error);
              else resolve(uploadStream.id);
            });
          });
        }
      }

      // Update permission
      const updatedPerm = await Permissions.findOneAndUpdate(
        { _id: permId },
        {
          $set: {
            name,
            abbreviation,
            description,
            scheduling,
            permission,
            image: fileId,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!updatedPerm) {
        return new Response('Failed to update permission', { status: 400 });
      }

      return new Response(JSON.stringify(updatedPerm), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ err, message: 'Failed to update permission' }), {
      status: 500,
    });
  }
}
