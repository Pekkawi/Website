// export const changeUserPermission = async (
//   permissionId: string,
//   userId: string,
//   isChecked: boolean
// ) => {
//   try {
//     await fetch("api/users", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ permissionId, userId, isChecked }),
//     });
//   } catch (error) {
//     console.error("Network error:", error);
//   }
// };
