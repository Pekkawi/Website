import permissions from "@/database/permission.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const users = await permissions.find({});

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch Users", { status: 500 });
  }
}
