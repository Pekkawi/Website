// app/(auth)/pending-approval/page.tsx
'use client';
import { motion } from 'framer-motion';
import { FaClock, FaEnvelope, FaUserClock, FaCheckCircle } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PendingApprovalPage = () => {
  const { data: session, update } = useSession(); // Add update function
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  // Redirect if user is already approved
  useEffect(() => {
    if (session?.user) {
      const userAccess = (session.user as any)?.access;
      if (userAccess && userAccess !== 'Pending') {
        router.push('/');
      }
    }
  }, [session, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      // Call an API endpoint to check current database status
      const response = await fetch('api/user_credentials');
      const data = await response.json();
      console.log('The current data is:', data);
      if (data.access !== 'Pending') {
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            access: data.access,
            role: data.role,
          },
        });

        // Show success message briefly
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        // Still pending - show a toast or message
        alert('Your account is still pending approval');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      alert('Error checking status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Icon and Title */}
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
              <FaUserClock className="text-4xl text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Account Pending Approval
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your registration was successful!
            </p>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {userEmail}
                </span>
              </div>
              {userName && (
                <div className="flex items-center gap-2 text-sm">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Registered as:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {userName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20 p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaClock className="text-orange-600 text-lg mt-0.5" />
              <div>
                <p className="font-semibold text-orange-800 dark:text-orange-400 mb-1">
                  Waiting for Administrator
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-500">
                  An administrator needs to review and approve your account before you can
                  access the workshop management system.
                </p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              What happens next?
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-600">1.</span>
                <span>An administrator will review your registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-600">2.</span>
                <span>You'll either be approved or denied</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-600">3.</span>
                <span>You can then log in and access the website</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
            This usually takes less than 24 hours. If you need immediate access, please
            contact the workshop administrator directly.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApprovalPage;
