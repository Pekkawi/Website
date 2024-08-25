// http:localhost:3000/api/users

import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
   

    await connectToDatabase();

    // const some = await Permissions.find({}); // This is just to make sure that the model is registered with Mongoose.
    const users = await User.find({}).populate("permissions");
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

export async function DELETE(request: NextRequest) {
  try {
    // if (!verifyApiKey(request)) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }
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

export async function PATCH(request: NextRequest, response: NextResponse) {
  try {
    // if (!verifyApiKey(request)) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }
    await connectToDatabase();

    const requestBody = await request.json();
    const { permissionId, userId, isChecked } = requestBody;

    if (!userId || !permissionId || typeof isChecked !== "boolean") {
      return new NextResponse(
        JSON.stringify({ message: "Invalid request data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userToChangePerms = await User.findById(userId);
    if (!userToChangePerms) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isChecked) {
      if (!userToChangePerms.permissions.includes(permissionId)) {
        console.log("Adding permission to user");
        userToChangePerms.permissions.push(permissionId);
      }
    } else {
      console.log("Removing permission from user");
      userToChangePerms.permissions.pull(permissionId);
    }

    await userToChangePerms.save();

    return new NextResponse(
      JSON.stringify({ message: "Successfully changed permission" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Server error:", err); // Error handling
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: err }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
