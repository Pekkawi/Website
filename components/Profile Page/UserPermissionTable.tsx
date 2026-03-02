import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Types } from 'mongoose';
import Image from 'next/image';
import { IPerm } from '@/interfaces/database.interfaces';
import { useQuery } from 'react-query';
import { Check, X } from 'lucide-react';
import { getPermissions } from '@/hooks/permissionHooks';

const UserPermissionTable = ({
  userPermissions,
}: {
  userPermissions: Types.ObjectId[] | undefined;
}) => {
  const { data: perms = [] } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
  });

  const hasPermission = (permId: Types.ObjectId) => {
    if (!userPermissions || userPermissions.length === 0) return false;
    return userPermissions.some((userPerm) => userPerm.toString() === permId.toString());
  };

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Machine access
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            These are the machines you are able to use.
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-semibold">Image</TableHead>
            <TableHead className="font-semibold">Abbreviation</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Access</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perms.map((perm: IPerm) => {
            const allowed = hasPermission(perm._id);

            return (
              <TableRow
                key={perm._id.toString()}
                className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/40"
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    <div className="overflow-hidden rounded-lg border border-slate-200/70 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                      <Image
                        width={100}
                        height={100}
                        unoptimized
                        src={perm.image.toString()}
                        alt={perm.name}
                      />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-300">
                  {perm.abbreviation}
                </TableCell>

                <TableCell className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {perm.name}
                </TableCell>

                <TableCell>
                  {' '}
                  {hasPermission(perm._id) ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  )}{' '}
                </TableCell>
              </TableRow>
            );
          })}

          {perms.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
                There are no permissions available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserPermissionTable;
