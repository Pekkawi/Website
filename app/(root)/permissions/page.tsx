import React from 'react';
import PermissionsForm from '@/components/Permissions Page/PermissionsForm';
import PermissionList from '@/components/Permissions Page/PermissionList';

const PermissionPage = () => {
  return (
    <>
      <div className="background background-light900_dark300 mt-[-30px]">
        <h1 className="h1-bold text-dark100_light900">New Permissions</h1>
        <p className="mb-3 mt-[-10px]  text-gray-500">Add a new device group</p>
        <PermissionsForm />
      </div>

      <div className="background background-light900_dark300">
        <h1 className="h1-bold text-dark100_light900">Permissions</h1>
        <p className="mb-3 mt-[-10px]  text-gray-500">Available device groups</p>
        <PermissionList />
      </div>
    </>
  );
};

export default PermissionPage;
