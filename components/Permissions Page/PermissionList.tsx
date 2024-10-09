'use client';
import { useQuery } from 'react-query';
import PageLoader from '@/components/shared/PageLoader';
import { IPerm } from '@/interfaces/database.interfaces';
import PermissionsError from './PermissionsError';

async function getPermissions() {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await fetch('/api/permissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch permissions');
    }
    const permissions: IPerm[] = await res.json();
    return permissions;
  } catch (err) {
    throw err;
  }
}

const PermissionList = () => {
  const {
    data: perms,
    status,
    refetch,
  } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
  });

  if (status === 'loading') {
    return <PageLoader />;
  } else if (status === 'error') {
    return <PermissionsError onRetry={refetch} />;
  }

  return (
    <>
      {perms &&
        perms.map((perm) => (
          <div key={perm._id.toString()}>{/* Render permission details here */}</div>
        ))}
    </>
  );
};

export default PermissionList;
