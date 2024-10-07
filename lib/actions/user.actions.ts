"use server";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export async function getAllUsers() {
  try {
    await connectToDatabase();

    // Get all users from the "users" collection
    const users = await User.find({});

    users.sort((a, b) => { // sorting based on first name
      if (a.first_name < b.first_name) {
        return -1;
      } else if (a.first_name > b.first_name) {
        return 1;
      } else {
        return 0;
      }
    });

    return users;
  } catch (err) {
    console.error(err);
    return { error: "Failed to fetch users" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await connectToDatabase();

    // Delete the user from the "users" collection
    await User.deleteOne({ _id: userId });
    return { message: "User deleted successfully" };
  } catch (err) {
    console.error(err);
    return { error: "Failed to delete user" };
  }
}
