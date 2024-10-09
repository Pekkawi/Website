'use client';
import React from 'react';
import PermissionsForm from '@/components/Permissions Page/PermissionsForm';

const Permission = () => {
  return (
    <div className="background background-light900_dark300  p-1">
      <h1 className="h1-bold text-dark100_light900">New Permissions</h1>
      <p className="mb-2 mt-[-5px]  text-gray-500">Add a new device group</p>
      <PermissionsForm />

      {/* Add a list of existing permissions here */}
    </div>
  );
};

export default Permission;
