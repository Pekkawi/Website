import { baseNode } from '@/database/newnode.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const nodes = await baseNode.find({});

    const bambuPrinters = nodes.filter((node) => node.__t === 'Bambu Printer');

    const sortedBambuPrinters = bambuPrinters.sort(
      (a, b) => a.orderNumber - b.orderNumber
    );

    return NextResponse.json(sortedBambuPrinters, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
