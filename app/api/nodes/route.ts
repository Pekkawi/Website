import {
  BambuControlPanelNode,
  BambuPrinterNode,
  baseNode,
  LaserNode,
} from '@/database/newnode.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest } from 'next/server';

// fetch all the nodes from the database
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const nodes = await baseNode.find({});

    return new Response(JSON.stringify(nodes), { status: 200 });
  } catch (err) {}
}

// add a new node to the database
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const { type, ...payload } = formData;

    let createdDoc;

    switch (type) {
      case 'LAS': // Laser Cutter
        createdDoc = await LaserNode.create(payload);
        break;

      case 'BAM': // Bambu Printer
        createdDoc = await BambuPrinterNode.create(payload);
        break;
      case 'BCP': // Bambu Control Panel
        createdDoc = await BambuControlPanelNode.create(payload);
        break;
      default:
        createdDoc = await baseNode.create(payload);
    }

    return new Response(JSON.stringify(createdDoc), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response('Failed to create permission', { status: 500 });
  }
}
