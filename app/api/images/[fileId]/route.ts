import { connectToDatabase } from '@/lib/mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Extract fileId from the URL
    const fileId = request.nextUrl.pathname.split('/').pop();

    if (!fileId || !ObjectId.isValid(fileId)) {
      return new Response('Invalid fileId', { status: 400 });
    }

    const db = await connectToDatabase();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    let imageData = Buffer.from([]);

    downloadStream.on('data', (chunk) => {
      imageData = Buffer.concat([imageData, chunk]);
    });

    downloadStream.on('error', (err) => {
      console.error('Error downloading image:', err);
      return new Response('Failed to fetch image', { status: 500 });
    });

    return new Promise((resolve, reject) => {
      downloadStream.on('end', () => {
        resolve(
          new Response(imageData, {
            headers: {
              'Content-Type': 'image/jpeg', // Use appropriate content type
            },
            status: 200,
          })
        );
      });
    });
  } catch (err) {
    console.error('Error fetching image:', err);
    return new Response('Failed to fetch image', { status: 500 });
  }
}
