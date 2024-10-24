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
    console.log('Received formData:', formData); // Debug

    if (db instanceof Db) {
      const { name, abbreviation, description, scheduling, permission, image } = formData;
      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      const perm = await Permissions.findOne({ _id: permId });
      if (!perm) {
        return new Response('Permission not found', { status: 404 });
      }

      let fileId = perm.image; // Default to existing image

      // Check if we have a new image (base64 string)
      if (image && typeof image === 'string') {
        console.log('Processing image...'); // Debug
        console.log('image is' + image);

        // If it's not the existing API URL, process as new image
        if (image.includes('base64')) {
          console.log('New image detected'); // Debug

          // Delete old image if it exists
          if (perm.image) {
            try {
              await bucket.delete(perm.image);
            } catch (error) {
              console.error('Error deleting old image:', error);
            }
          }

          // Process base64 image
          try {
            const [, base64Data] = image.split(',');
            const contentType = image.match(/data:([^;]+);base64/)?.[1] || 'image/jpeg';

            const uploadStream = bucket.openUploadStream(name, {
              chunkSizeBytes: 261120,
              contentType,
            });

            const buffer = Buffer.from(base64Data, 'base64');

            fileId = await new Promise<Types.ObjectId>((resolve, reject) => {
              uploadStream.end(buffer, (error) => {
                if (error) {
                  console.error('Upload error:', error); // Debug
                  reject(error);
                } else {
                  resolve(uploadStream.id);
                }
              });
            });

            console.log('New fileId:', fileId); // Debug
          } catch (error) {
            console.error('Image processing error:', error); // Debug
            throw error;
          }
        } else {
          console.log('Using existing image URL'); // Debug
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

      console.log('Updated permission:', updatedPerm); // Debug

      return new Response(JSON.stringify(updatedPerm), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response('Database connection failed', { status: 500 });
  } catch (err) {
    console.error('PATCH error:', err); // Debug
    return new Response(JSON.stringify({ err, message: 'Failed to update permission' }), {
      status: 500,
    });
  }
}
