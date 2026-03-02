import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/mongoose';
import { Db, GridFSBucket, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Extract fileId from the URL
    const fileId = request.nextUrl.pathname.split('/').pop();

    if (!fileId || !ObjectId.isValid(fileId)) {
      return new Response('Invalid fileId', { status: 400 });
    }

    const db = await connectToDatabase();

    if (db instanceof Db) {
      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      // Convert the stream to buffer using async/await
      return new Promise<Response>((resolve, reject) => {
        const chunks: Buffer[] = [];
        const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

        downloadStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        downloadStream.on('error', (error: Error) => {
          console.error('Error downloading image:', error);
          resolve(new Response('Failed to fetch image', { status: 500 }));
        });

        downloadStream.on('end', () => {
          const buffer = Buffer.concat(chunks as unknown as Uint8Array[]);
          resolve(
            new Response(buffer, {
              headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000',
              },
              status: 200,
            })
          );
        });
      });
    } else {
      return new Response('Bad Database connection', { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
