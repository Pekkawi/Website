'use client';
import { deleteUser, getUserDetails } from '@/hooks/userHooks';
import { IPerm } from '@/interfaces/database.interfaces';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import DropDownLoading from './DropDownLoading';
import RoleSelector from './RoleSelector';
import UserCheckBox from './UserCheckBox';
import { Button } from '../ui/button';
import UserHistoryDialog from './UserHistoryDialog';

const UserDetails = ({
  userId,
  roles,
  Permissions,
  statusPermission,
  handleToggle,
}: {
  userId: string;
  roles: string[];
  Permissions: IPerm[] | undefined;
  statusPermission: 'idle' | 'error' | 'loading' | 'success';
  handleToggle: (userId: string) => void;
}) => {
  const { data, status } = useQuery<any>( // TODO: Fix any | temp fix
    ['DetailsUser', userId],
    () => getUserDetails(userId),
    {
      enabled: !!userId,
      staleTime: Infinity,
    }
  );

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation(() => deleteUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['DetailsUser', userId]);
    },
  });

  if (status === 'loading' || statusPermission === 'loading') {
    return <DropDownLoading />;
  }
  if (status === 'error' || statusPermission === 'error') {
    return <div>Error fetching data</div>;
  }

  return (
    <motion.div
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { opacity: 1, height: 'auto' },
        collapsed: { opacity: 0, height: 0 },
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative overflow-hidden"
    >
      <div className="relative grid grid-cols-1 justify-items-start px-4 pb-7 md:items-baseline mmd:grid-cols-2 mmd:grid-rows-1">
        <div className="absolute left-3 top-6">
          <RoleSelector userId={userId} userRole={data?.user?.role} roles={roles} />
        </div>
        <div className="absolute bottom-5 right-10 ">
          <UserHistoryDialog userId={userId} />

          <Button
            className="m-1 rounded bg-red-600 px-3 py-1 font-bold text-white hover:bg-red-700 md:px-4 md:py-2 xl:px-7 xl:py-2"
            onClick={() => {
              handleToggle(userId); // once a user has been delete close the dropdown
              deleteUserMutation.mutate();
            }}
          >
            Delete
          </Button>
        </div>
        <div className="">
          <div className="mt-20">
            <h4 className="text-dark100_light900">Card number</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {data?.user?.card_number}
            </p>
          </div>
          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">Card ID</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {data?.user?.card_id}
            </p>
          </div>
        </div>
        <div className="mmd:relative mmd:bottom-12">
          <div>
            {Permissions?.map((permission) => (
              <div key={`${permission._id}`} className="mt-2">
                <UserCheckBox
                  Permission={permission}
                  UsersPermissions={data?.user?.permissions || []}
                  userId={data?.user?._id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetails;
