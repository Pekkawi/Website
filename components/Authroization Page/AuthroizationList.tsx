import React, { useState, useEffect } from 'react';
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
import {
  deleteUserCredentials,
  editUserCredentialRole,
  getUserCredentials,
  updateUserAccess,
} from '@/hooks/userCredentialsHook';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { X, Check, Loader2, CheckCircle, XCircle } from 'lucide-react';
import DeleteUserCredentialDialog from './DeleteUserCredentialDialog';
import { useSession } from 'next-auth/react';

// Toast Notification Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        animate-slide-in fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3
        shadow-lg transition-all duration-300
        ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
      `}
    >
      {type === 'success' ? (
        <CheckCircle className="size-5" />
      ) : (
        <XCircle className="size-5" />
      )}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 transition-opacity hover:opacity-80">
        <X className="size-4" />
      </button>
    </div>
  );
};

const AuthroizationList = () => {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const role = session?.user?.role;
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

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
        setToast({ message: 'Role updated successfully', type: 'success' });
      },
      onError: () => {
        setToast({ message: 'Failed to update role', type: 'error' });
      },
    }
  );

  // Mutation for granting access
  const AccessPendingMutation = useMutation(
    ({ access, id }: { access: 'Granted' | 'Denied'; id: string }) =>
      updateUserAccess(access, id),
    {
      onMutate: ({ id }) => {
        setLoadingUserId(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries('userCredentials');
        setToast({ message: 'Access granted successfully', type: 'success' });
        setLoadingUserId(null);
      },
      onError: (error) => {
        console.error('Error updating access:', error);
        setToast({ message: 'Failed to grant access', type: 'error' });
        setLoadingUserId(null);
      },
    }
  );

  const DeleteUserMutation = useMutation((id: string) => deleteUserCredentials(id), {
    onMutate: (id) => {
      setLoadingUserId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('userCredentials');
      setToast({ message: 'User deleted successfully', type: 'success' });
      setLoadingUserId(null);
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      setToast({ message: 'Failed to delete user', type: 'error' });
      setLoadingUserId(null);
    },
  });

  const handleDenyAccess = (id: string) => {
    DeleteUserMutation.mutate(id);
  };

  const handleGrantAccess = (id: string) => {
    AccessPendingMutation.mutate({ access: 'Granted', id });
  };

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
            <TableHead className="text-center">Access</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userCredentials && userCredentials.length > 0 ? (
            userCredentials.map((cred: IUserCredential) => (
              <TableRow
                key={cred.email}
                className={loadingUserId === cred._id ? 'opacity-50' : ''}
              >
                <TableCell>{cred.name}</TableCell>
                <TableCell>{cred.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    <Select
                      defaultValue={cred.role}
                      onValueChange={(role) =>
                        RoleChangeMutation.mutate({ role, id: cred._id })
                      }
                      disabled={
                        loadingUserId === cred._id ||
                        cred.access !== 'Granted' ||
                        cred.email === email ||
                        role !== 'Admin'
                      }
                    >
                      <SelectTrigger id="role" className="group w-24">
                        <SelectValue placeholder={cred.role} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {cred.access === 'Pending' && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Pending
                    </span>
                  )}
                  {cred.access === 'Granted' && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Granted
                    </span>
                  )}
                  {cred.access === 'Denied' && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Denied
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {cred.access === 'Granted' && (
                    <DeleteUserCredentialDialog
                      credId={cred._id}
                      disabled={cred.email === email}
                    />
                  )}
                  {cred.access === 'Pending' && (
                    <div className="flex items-center space-x-1">
                      {loadingUserId === cred._id ? (
                        <div className="flex size-9 items-center justify-center">
                          <Loader2 className="size-5 animate-spin text-gray-400" />
                        </div>
                      ) : (
                        <>
                          <button
                            className="group flex size-9 items-center justify-center rounded-full transition-colors hover:bg-green-100"
                            onClick={() => handleGrantAccess(cred._id)}
                            disabled={loadingUserId !== null}
                            title="Grant Access"
                          >
                            <Check className="size-5 text-gray-400 group-hover:text-green-600" />
                          </button>
                          <button
                            className="group flex size-9 items-center justify-center rounded-full transition-colors hover:bg-red-100"
                            onClick={() => handleDenyAccess(cred._id)}
                            disabled={loadingUserId !== null}
                            title="Deny Access & Delete"
                          >
                            <X className="size-5 text-gray-400 group-hover:text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                There are no users on the platform
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Add these styles to your global CSS or create a separate CSS module */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AuthroizationList;
