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
