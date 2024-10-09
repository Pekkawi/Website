'use client';

import { IPerm } from '@/interfaces/database.interfaces';
import { Types } from 'mongoose';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

const updateUserPermission = async (
  userId: Types.ObjectId,
  permissionId: Types.ObjectId
) => {
  try {
    const response = await fetch(`/api/users/${userId}/permissions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissionId }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user role');
    }
    return await response.json();
  } catch (err) {
    return undefined;
  }
};

const UserCheckBox = ({
  Permission,
  UsersPermissions,
  userId,
}: {
  Permission: IPerm;
  UsersPermissions: Types.ObjectId[];
  userId: Types.ObjectId;
}) => {
  const [checked, setChecked] = useState(!!UsersPermissions.includes(Permission._id));
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (permissionId: Types.ObjectId) => updateUserPermission(userId, permissionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['DetailsUser', userId]);
      },
    }
  );

  function handleRoleChange() {
    setChecked((prev) => !prev);
    mutation.mutate(Permission._id);
  }

  return (
    <label className="flex items-start space-x-3">
      <input
        type="checkbox"
        className="size-5 rounded border-gray-700 bg-gray-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900"
        checked={checked}
        onChange={handleRoleChange}
      />
      <span className="text-gray-400">
        {Permission.abbreviation}: {Permission.name}
      </span>
    </label>
  );
};
export default UserCheckBox;
