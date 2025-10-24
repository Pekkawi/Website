import { auth } from '@/auth';
import Devices from '@/database/device.model';
import {
  BambuControlPanelNode,
  BambuPrinterNode,
  baseNode,
  LaserNode,
} from '@/database/newnode.model';
import Permissions from '@/database/permission.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

// fetch all the nodes from the database
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    let nodes = await baseNode.find({});

    nodes = nodes.sort((a, b) => a.orderNumber - b.orderNumber);

    return new Response(JSON.stringify(nodes), { status: 200 });
  } catch (err) {}
}

// add a new node to the database
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectToDatabase();
    const formData = await request.json();
    const { type } = formData;

    let createdDoc;

    switch (type) {
      case 'LAS': {
        const serial = formData.Device || formData.SerialNumber;
        if (!serial) return new Response('Serial number missing', { status: 400 });

        const [perm, device] = await Promise.all([
          Permissions.findOne({ abbreviation: 'LAS' }),
          Devices.findOne({ serial_number: serial }),
        ]);

        if (!perm) return new Response('Permission "LAS" not found', { status: 400 });
        if (!device) return new Response(`Device "${serial}" not found`, { status: 400 });

        const newNode = await new LaserNode({
          name: formData.name,
          permission: perm._id,
          device: device._id,
        }).save();

        await Devices.updateOne({ _id: device._id }, { $set: { node: newNode._id } });
        createdDoc = newNode; // so you can send it back
        break;
      }

      case 'BAM': {
        // Bambu Printer
        const serial = formData.Device || formData.SerialNumber;
        if (!serial) return new Response('Serial number missing', { status: 400 });

        const [perm, owner] = await Promise.all([
          Permissions.findOne({ abbreviation: 'BAM' }),
          baseNode.findOne({ name: formData.owner }),
        ]);

        if (!perm) return new Response('Permission "BAM" not found', { status: 400 });
        if (!owner) return new Response('Failed to Fetch Owner', { status: 400 });

        const newNode = await new BambuPrinterNode({
          name: formData.name,
          permission: perm._id,
          IP: formData.IP,
          SerialNumber: formData.SerialNumber,
          accessCode: formData.accessCode,
          owner: owner._id,
        }).save();

        await BambuControlPanelNode.updateOne(
          { _id: owner._id },
          { $push: { owns: newNode._id } }
        );

        createdDoc = newNode; // so you can send it back
        break;
      }
      case 'BCP': {
        const serial = formData.Device || formData.SerialNumber;
        if (!serial) return new Response('Serial number missing', { status: 400 });

        const [perm, device] = await Promise.all([
          Permissions.findOne({ abbreviation: 'BCP' }),
          Devices.findOne({ serial_number: serial }),
        ]);

        if (!perm) return new Response('Permission "BCP" not found', { status: 400 });
        if (!device) return new Response(`Device "${serial}" not found`, { status: 400 });

        const newNode = await new BambuControlPanelNode({
          name: formData.name,
          permission: perm._id,
          device: device._id,
        }).save();

        await Devices.updateOne({ _id: device._id }, { $set: { node: newNode._id } });
        createdDoc = newNode; // so you can send it back
        break;
      }
    }

    return new Response(JSON.stringify(createdDoc), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response('Failed to create permission', { status: 500 });
  }
}
