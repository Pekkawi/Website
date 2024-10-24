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
import { useQuery, useQueryClient } from 'react-query';
import PageLoader from '@/components/shared/PageLoader';
import PermissionsError from './PermissionsError';
import Image from 'next/image';
import { X, Check } from 'lucide-react';

import DeletePermissionDialog from './DeletePermDialog';
import EditPermissionDialog from './EditPermDialog';
import { getPermissions } from '@/hooks/permissionHooks';
import { IPerm } from '@/interfaces/database.interfaces';

const PermissionList = () => {
  const queryClient = useQueryClient();

  const {
    data: perms,
    status,
    refetch,
  } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
    onSuccess: (data) => {
      // Pre-populate the query cache with individual permissions
      data.forEach((perm: IPerm) => {
        queryClient.setQueryData(['permission', perm._id], perm);
      });
    },
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
            perms.map((perm: IPerm) => (
              <TableRow key={perm._id.toString()}>
                {/* <TableCell>
                  <Image width={50} height={50} src={`/${perm.image}`} alt={perm.name} />
                </TableCell> */}
                <TableCell>
                  <Image
                    width={170}
                    height={170}
                    src={perm.image.toString()} // Use the full image URL returned from the GET route
                    alt={perm.name}
                    onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} // Optionally add a fallback image
                  />
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
                  <EditPermissionDialog permId={perm._id} initialData={perm} />
                  <DeletePermissionDialog permId={perm._id} />
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
