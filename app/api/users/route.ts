// http:localhost:3000/api/users

import Permissions from "@/database/permission.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const users = await User.find({}).populate("permissions");
    const some = await Permissions.find({}); // This is just to make sure that the model is registered with Mongoose.
    users.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1;
      } else if (a.first_name > b.first_name) {
        return 1;
      } else {
        return 0;
      }
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch Users", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body to get userId
    const requestBody = await request.json();
    const userId = requestBody.userId;

    // Delete the user
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Respond with success message
    return new Response(
      JSON.stringify({ message: "User successfully deleted" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    // Error handling
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
}
