import { auth } from '@/auth';
import Devices from '@/database/device.model';
import { BambuPrinterNode, baseNode } from '@/database/newnode.model';
import { NodeType } from '@/interfaces/nodes.interface';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Deleting a Node
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin DENY their request
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const nodeId = params.id;
    await connectToDatabase(); // connect to MongoDB

    // 1) Load the node document (to inspect __t, device, etc.)
    const nodeDoc = await baseNode.findOne({ _id: nodeId }).lean<NodeType>();

    if (!nodeDoc) {
      return new Response(JSON.stringify({ message: 'Node not found' }), { status: 404 });
    }

    // 2) Use switch on nodeDoc.__t to perform type-specific logic
    switch (nodeDoc.__t) {
      case 'Bambu Printer':
        // If this is a Bambu Printer, remove its ID from the owning Control Panel’s owns[] array
        await baseNode.updateOne(
          {
            __t: 'Bambu Control Panel', // only target control panels
            owns: nodeId, // whose owns[] contains this printer’s ID
          },
          {
            $pull: { owns: nodeId }, // remove the printer ID from that array
          }
        );
        break;
      case 'Laser Cutter':
        await Devices.updateOne(
          {
            node: nodeId,
          },
          {
            $unset: { node: '' },
          }
        );

        break;
      case 'Bambu Control Panel':
        await Devices.updateOne(
          {
            node: nodeId,
          },
          {
            $unset: { node: '' },
          }
        );

        await baseNode.deleteMany({ _id: { $in: nodeDoc.owns } });

        break;
      default:
        // No special cleanup needed for other node types
        break;
    }

    // 3) Delete the node itself
    const deleteResult = await baseNode.deleteOne({ _id: nodeId });
    if (deleteResult.deletedCount === 0) {
      // If nothing was deleted, return 404
      return new Response(JSON.stringify({ message: 'Node could not be deleted' }), {
        status: 404,
      });
    }

    // 4) Success
    return new Response(JSON.stringify({ message: 'Successfully deleted the node' }), {
      status: 200,
    });
  } catch (err) {
    // 5) Unexpected error
    return new Response(JSON.stringify({ err, message: 'Failed to delete node' }), {
      status: 500,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();

    // If someone is not logged in, block their request
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // If the user who is logged in is not an admin
    if (session?.user?.role !== 'Admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const nodeId = params.id;
    await connectToDatabase(); // connect to MongoDB
    const data = await request.json();
    const updateNode = await BambuPrinterNode.findOneAndUpdate(
      { _id: nodeId },
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
      }
    );

    if (!updateNode) {
      return NextResponse.json('Failed to update node', { status: 400 });
    }
    console.log(`Succesfully Updated ${data.name}`);
    return NextResponse.json(updateNode, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      {
        status: 500,
      }
    );
  }
}
