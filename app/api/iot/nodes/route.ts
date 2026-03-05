import { baseNode } from '@/database/newnode.model';
import { requireAnyIotBearer } from '@/lib/iotAuth';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAnyIotBearer(request as any, ['API_KEY_PRINTERS']);
    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.msg },
        { status: auth.status, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    await connectToDatabase();

    const bambuPrinters = await baseNode
      .find({ __t: 'Bambu Printer' })
      .sort({ orderNumber: 1 })
      .lean();

    return NextResponse.json(bambuPrinters, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
