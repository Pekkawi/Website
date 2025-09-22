import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IUserCredential } from '@/database/usercredential.model';
import PageLoader from '../shared/PageLoader';
import UserCredentialsError from './UserCredentialsError';
import { editUserCredentialRole, getUserCredentials } from '@/hooks/userCredentialsHook';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Trash } from 'lucide-react';

const AuthroizationList = () => {
  const queryClient = useQueryClient();

  const {
    data: userCredentials,
    status,
    refetch,
  } = useQuery('userCredentials', getUserCredentials, {
    staleTime: Infinity,
    onSuccess: (userCredentials) => {
      queryClient.setQueryData<IUserCredential[]>('userCredentials', userCredentials);
    },
  });

  const RoleChangeMutation = useMutation(
    ({ role, id }: { role: string; id: string }) => editUserCredentialRole(role, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userCredentials');
      },
    }
  );

  if (status === 'loading') {
    return <PageLoader />;
  } else if (status === 'error') {
    return <UserCredentialsError onRetry={refetch} />;
  }

  return (
    <>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="justify-center">Access</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userCredentials &&
            userCredentials.map((cred: IUserCredential) => (
              <TableRow key={cred.email}>
                <TableCell>{cred.name}</TableCell>
                <TableCell>{cred.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    <Select
                      defaultValue={cred.role}
                      onValueChange={(role) =>
                        RoleChangeMutation.mutate({ role, id: cred._id })
                      }
                    >
                      <SelectTrigger id="role" className="w-24 group">
                        <SelectValue placeholder={cred.role} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  {cred.access === 'Pending' && (
                    <p className="text-yellow-500"> Pending</p>
                  )}
                  {cred.access === 'Granted' && (
                    <p className="text-green-500"> Granted</p>
                  )}
                  {cred.access === 'Denied' && <p className="text-red-500"> Denied</p>}
                </TableCell>
                <TableCell>
                  <button className="rounded-full p-2 hover:bg-gray-100 transition">
                    <Trash className="size-5 text-gray-400" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          {userCredentials === undefined && <p> There are no users on the platform</p>}
        </TableBody>
      </Table>
    </>
  );
};

export default AuthroizationList;
