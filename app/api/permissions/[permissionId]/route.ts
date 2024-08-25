import Permissions from "@/database/permission.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
  request: NextRequest,
  { params }: { params: { permissionId: string } },
  response: NextResponse
) {
  try {
  
    await connectToDatabase();
    const { permissionId } = params;

    const permission = await Permissions.findById(permissionId);
    if (!permission) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(permission, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch permission" },
      { status: 500 }
    );
  }
}
