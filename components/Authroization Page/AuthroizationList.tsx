import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useQuery, useQueryClient } from 'react-query';
import { IUserCredential } from '@/database/usercredential.model';
import PageLoader from '../shared/PageLoader';
import UserCredentialsError from './UserCredentialsError';
import { editUserCredentialRole, getUserCredentials } from '@/hooks/userCredentialsHook';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ChevronDown } from 'lucide-react';

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

  const changeUserRole = (role: string, credentialId: string) => {};

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
            <TableHead>Access</TableHead>
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
                      onValueChange={(role) => editUserCredentialRole(role, cred._id)}
                    >
                      <SelectTrigger id="role" className="w-[240px] group">
                        <SelectValue placeholder={cred.role} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
