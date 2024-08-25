import Permissions from "@/database/permission.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest } from "next/server";



export async function GET(request: NextRequest) {
  try {
    
    await connectToDatabase();
    const perms = await Permissions.find({});

    return new Response(JSON.stringify(perms), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch permissions", { status: 500 });
  }
}
