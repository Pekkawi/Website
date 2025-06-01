import Devices from '@/database/device.model';
import { connectToDatabase } from '@/lib/mongoose';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const devices = await Devices.find({}); // fetches all the devices

    return new Response(JSON.stringify(devices), { status: 200 });
  } catch (err) {
    return new Response('Failed to fetch permissions', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const {
      device_model: deviceModel,
      serial_number: serialNumber,
      application_name: applicationName,
      mac_address: macAddress,
    } = await request.json();

    if (!deviceModel || !serialNumber || !applicationName || !macAddress) {
      return new Response('Missing required fields', { status: 400 });
    }

    const newDevice = new Devices({
      device_model: deviceModel,
      serial_number: serialNumber,
      application_name: applicationName,
      mac_address: macAddress,
    });

    await newDevice.save();
    return new Response(JSON.stringify(newDevice), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response('Failed to create device', { status: 500 });
  }
}
