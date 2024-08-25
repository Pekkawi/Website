import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";

import { NextRequest, NextResponse } from "next/server";



export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
  response: NextResponse
) {
  try {
    

    await connectToDatabase();
    const { userId } = params;
    const { role } = await request.json();
    console.log(role);
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    user.role = role;
    return NextResponse.json(await user.save(), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
}
