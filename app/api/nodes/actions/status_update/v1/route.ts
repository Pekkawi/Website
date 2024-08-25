
// Ensure the permissions model is imported to register it with Mongoose.
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest } from "next/server";
import NewNode from "@/database/node.model";



export async function POST(request: NextRequest) {
  try {
    
    const data = await request.json();
    // Establish a connection to the database.
    await connectToDatabase();
    // Attempt to find a user by card_id and populate their permissions.
    const { status,serialNumber } = data;
    const nodeToChange = await NewNode.findOneAndUpdate({ serialNumber }, { Status: status });
    
    if (!nodeToChange) {
      return new Response("Node not found", { status: 404 });
    }

     nodeToChange.Status = status;
    await nodeToChange.save(); 
    
    return new Response("Node status updated", { status: 200 });
  
  } catch (err) {
    // Log the error for debugging purposes.
    console.error(err);
    // Return a 500 response in case of any errors.
    return new Response("Failed to fetch user", { status: 500 });
  }
}
