import Node from "@/database/node.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    // get the dynamic id from the url
    const { id } = await req.json();
    // Connect to the database
    await connectToDatabase();

    const result = await Node.findOneAndDelete({ SerialNumber: id.toString() });
    console.log(result);
    if (result !== null) {
      return new Response(
        JSON.stringify({ message: "Node deleted successfully" }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(JSON.stringify({ message: "Node not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
