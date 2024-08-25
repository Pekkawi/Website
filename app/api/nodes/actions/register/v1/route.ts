// function to veirfy the api key

import NewNode from "@/database/node.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest, response: NextResponse) {
  try {
  

    await connectToDatabase();
    const requestBody = await request.json();

    const { SerialNumber, MACAddress, os } = requestBody;

    if (!SerialNumber || !MACAddress || !os) {
      return new Response(JSON.stringify({ error: "Invalid Request" }), {
        status: 400,
      });
    }

    const existingNode = await NewNode.findOne({
      SerialNumber,
    });

    if (existingNode) {
      return new Response(JSON.stringify({ message: "Node already exists" }), {
        status: 200,
      });
    }

    const CreatingNode = new NewNode({
      SerialNumber,
      MACAddress,
      Status: "Open",
      os,
    });

    await CreatingNode.save();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
