"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  Types } from "mongoose";
import { useMutation, useQueryClient } from "react-query";


const updateUserRole = async (userId: Types.ObjectId, role: string) => {

    const response = await fetch(`/api/users/${userId}/role`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({role})
    });
    if(!response.ok){
        throw new Error('Failed to update user role');
    }
    return response.json();

}



const RoleSelector = ({ userId,userRole,roles}:{userId:Types.ObjectId, userRole:string,roles:string[]}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "User"
  );
  const queryClient = useQueryClient();
  
  const mutation = useMutation( (newRole:string) => updateUserRole(userId,newRole),{
    onSuccess: () =>{
        queryClient.invalidateQueries(['DetailsUser',userId]);
    }
  } )

  const handleRoleChange = (role:string) =>{
    setSelectedRole(role);
    setIsOpen(false);
    mutation.mutate(role.toLowerCase());
    
  }

  return (
    <div className="mx-auto w-auto xss:min-w-[300px] lg:min-w-[320px] ">
      <div className="relative">
        <label className="absolute -top-2.5 left-3 bg-white px-1 text-sm font-medium text-gray-700">
          Role <span className="text-red-500">*</span>
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <span className="block truncate">{selectedRole}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <motion.svg
              className={`size-5 text-gray-400${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </motion.svg>
          </span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
            >
              <ul className="max-h-60 overflow-visible rounded-md py-1 text-base leading-6 shadow-sm focus:outline-none sm:text-sm sm:leading-5">
                {roles.map((role, index) => (
                  <li
                    key={index}
                    onClick={() => {
                        handleRoleChange(role);
                    }}
                    className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
                  >
                    <span className="block truncate">{role}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoleSelector;
