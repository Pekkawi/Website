'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from 'react-query';
import PageLoader from '@/components/shared/PageLoader';
import { IPerm } from '@/interfaces/database.interfaces';
import PermissionsError from './PermissionsError';
import Image from 'next/image';
import { X, Check } from 'lucide-react';

import DeletePermissionDialog from './DeletePermDialog';
import EditPermissionDialog from './EditPermDialog';

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
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableCaption>Image</TableCaption>
            <TableHead>Abbreviation</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Scheduling</TableHead>
            <TableHead>Default permission</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perms &&
            perms.map((perm) => (
              <TableRow key={perm._id.toString()}>
                <TableCell>
                  <Image width={50} height={50} src={'/icons/account.svg'} />
                </TableCell>
                <TableCell>{perm.abbreviation}</TableCell>
                <TableCell>{perm.name}</TableCell>
                <TableCell>
                  {perm.description ? (
                    perm.description
                  ) : (
                    <p className="italic text-gray-600 ">None</p>
                  )}{' '}
                </TableCell>
                <TableCell>
                  {perm.scheduling === 'locking' ? <p>Locking</p> : <p>On Demand</p>}
                </TableCell>
                <TableCell>
                  {perm.default ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  )}
                </TableCell>
                <TableCell className="space-y-1 ">
                  <EditPermissionDialog />
                  <DeletePermissionDialog />
                </TableCell>
              </TableRow>
            ))}
          {
            perms === undefined && (
              <p>There are no permissions available</p>
            ) /*  To be added , animation */
          }
        </TableBody>
      </Table>
    </>
  );
};

export default PermissionList;
